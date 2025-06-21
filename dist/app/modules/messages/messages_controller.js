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
exports.messagesController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const messages_services_1 = require("./messages_services");
const getMessages = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderId, receiverId, page, limit } = req.query;
    try {
        const message = yield messages_services_1.messageServices.fetchMessages({
            currentUserId: req.user._id,
            senderId: senderId,
            receiverId: receiverId,
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
        });
        res.json(message);
    }
    catch (error) {
        res.status(500).json({ message: "Error Fetching Messages" });
    }
}));
const getChatRoom = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rooms = yield messages_services_1.messageServices.chatRoom(req.userId);
        res.status(200).json(rooms);
    }
    catch (error) {
        console.error('Error fetching chat rooms:', error);
        res.status(500).json({ message: 'Error Fetching Rooms' });
    }
}));
exports.messagesController = {
    getMessages,
    getChatRoom,
};
