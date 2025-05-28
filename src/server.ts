import { Server } from "http";
import mongoose from "mongoose";
import config from "./app/config";
import app from "./app";
import { Server as SocketIOServer } from "socket.io";
import { MessageModel } from "./app/modules/messages/messages_model";
import { deleteFile, saveFile } from "./app/utils/fileStorageService";
import path from 'path';
import fs from 'fs';


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
                    file: filePath,
                    fileName,
                    timestamp: new Date(),
                });
                
                
                await newMessage.save();

                io.to(roomId).emit('newMessage', {
                    _id: newMessage._id,
                    roomId,
                    senderId,
                    receiverId,
                    message,
                    image,
                    file: filePath,
                    fileName,
                    timestamp: newMessage.timestamp,
                });
                  
            });

            socket.on('deleteMessage', async (data) => {
                try {
                    const { id, roomId, senderId } = data;
                    
                    console.log(data);
                    const message = await MessageModel.findById(id);

                    if (!message) {
                        console.log('[WARNING] Message not found');
                        return;
                    }

                    if (message.senderId.toString() !== senderId) {
                        console.log('[ERROR] Unauthorized deletion attempt');
                        return;
                    }

                    if (message.image) {
                        console.log(`[INFO] Attempting to delete image: ${message.image}`);
                        const imageDeleted = deleteFile(message.image);
                        if (!imageDeleted) {
                            console.log('[WARNING] Image deletion failed');
                        }
                    }

                    if (message.file) {
                        console.log(`[INFO] Attempting to delete file: ${message.file}`);
                        const fileDeleted = deleteFile(message.file);
                        if (!fileDeleted) {
                            console.log('[WARNING] File deletion failed');
                        }
                    }

                    const deletedMessage = await MessageModel.findOneAndDelete({
                        _id: id,
                        senderId: senderId
                    });
                    
                    if (deletedMessage) {
                        io.to(roomId).emit('messageDeleted', { 
                            id: deletedMessage._id.toString()
                        });
                    }

                    
                } catch (error) {
                    console.log(error);
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