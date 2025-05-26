import { Server } from "http";
import mongoose from "mongoose";
import config from "./app/config";
import app from "./app";
import { Server as SocketIOServer } from "socket.io";
import { MessageModel } from "./app/modules/messages/messages_model";
import { saveFile } from "./app/utils/fileStorageService";

let server: Server;

async function main() {
    try {
        await mongoose.connect(config.db_url as string);

        server = app.listen(config.port, () => {
            console.log(`Server is running on port ${config.port}`);
        })

        const io = new SocketIOServer(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        io.on("connection", (socket) => {
            console.log("✅ Client connected:", socket.id);

            socket.on('sendMessage', async (data) => {
                const { roomId, senderId, receiverId, message, image, file, fileName } = data;

                let imagePath: string | undefined;
                let filePath: string | undefined;

                if(image) {
                    const extension = image.startsWith('data:image/')
                    ? image.split(';')[0].split('/')[1] : 'jpg';
                    imagePath = saveFile(image, extension);
                }

                if (file) {
                    const extension = fileName?.split('.').pop() || 'bin';
                    filePath = saveFile(file, extension);
                }

                const newMessage = new MessageModel({
                    roomId,
                    senderId,
                    receiverId,
                    message,
                    image,
                    file,
                    fileName,
                    timestamp: new Date(),
                });

                await newMessage.save();

                io.to(roomId).emit('newMessage', {
                ...newMessage.toObject(),
                
                image: undefined,
                file: undefined,
                });
            });

            socket.on('deleteMessage', async (data) => {
                const {_id, roomId, senderId} = data;

                try {
                    const message = await MessageModel.findById(_id);

                    if(!message) return;

                    if(message.senderId !== senderId) return;

                    await message.deleteOne();

                    io.to(roomId).emit('messageDeleted', {_id});
                } catch (error) {
                    console.error("❌ Error deleting message:", error);
                }
            });

            socket.on("disconnect", () => {
                console.log("❌ Client disconnected:", socket.id);
            });

        });
        
    } catch (error) {
        console.log(error);
    }
}

main();

process.on('uncaughtException', () => {
    console.log('uncaughtException id detected, shutting down ...');
    if(server) {
        server.close(() => {
            process.exit(1);
        })
    }
    process.exit(1);
});