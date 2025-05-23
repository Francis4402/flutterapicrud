import { Server } from "http";
import mongoose from "mongoose";
import config from "./app/config";
import app from "./app";
import { Server as SocketIOServer } from "socket.io";

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

            socket.on('sendMessage', (message) => {
                console.log('new message is:', message);
                io.emit('newMessage', message);
            })

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