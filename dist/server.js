"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./app/config"));
const app_1 = __importDefault(require("./app"));
const socket_io_1 = require("socket.io");
const messages_model_1 = require("./app/modules/messages/messages_model");
const fileStorageService_1 = require("./app/utils/fileStorageService");
let server;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.default.db_url);
            server = app_1.default.listen(config_1.default.port, () => {
                console.log(`Server is running on port ${config_1.default.port}`);
            });
            const io = new socket_io_1.Server(server, {
                cors: {
                    origin: "*",
                    methods: ["GET", "POST"]
                }
            });
            io.on("connection", (socket) => {
                console.log("✅ Client connected:", socket.id);
                socket.on('sendMessage', (data) => __awaiter(this, void 0, void 0, function* () {
                    const { roomId, senderId, receiverId, message, image, file, fileName } = data;
                    let imagePath;
                    let filePath;
                    if (image) {
                        const extension = image.startsWith('data:image/')
                            ? image.split(';')[0].split('/')[1] : 'jpg';
                        imagePath = (0, fileStorageService_1.saveFile)(image, extension);
                    }
                    if (file) {
                        const extension = (fileName === null || fileName === void 0 ? void 0 : fileName.split('.').pop()) || 'bin';
                        filePath = (0, fileStorageService_1.saveFile)(file, extension);
                    }
                    const newMessage = new messages_model_1.MessageModel({
                        roomId,
                        senderId,
                        receiverId,
                        message,
                        image,
                        file,
                        fileName,
                        timestamp: new Date(),
                    });
                    yield newMessage.save();
                    io.to(roomId).emit('newMessage', Object.assign(Object.assign({}, newMessage.toObject()), { image: undefined, file: undefined }));
                }));
                socket.on("disconnect", () => {
                    console.log("❌ Client disconnected:", socket.id);
                });
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
main();
process.on('uncaughtException', () => {
    console.log('uncaughtException id detected, shutting down ...');
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
