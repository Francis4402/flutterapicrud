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
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesRoute = void 0;
const express_1 = require("express");
const messages_model_1 = require("./messages_model");
const router = (0, express_1.Router)();
router.get('/:user1/:user2', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user1, user2 } = req.params;
    const roomId = `room_${[user1, user2].sort().join("_")}`;
    try {
        const messages = yield messages_model_1.MessageModel.find({ roomId }).sort({ timestamp: 1 });
        res.status(200).json(messages);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
}));
router.patch('/read/:senderId/:receiverId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderId, receiverId } = req.params;
    try {
        yield messages_model_1.MessageModel.updateMany({ senderId, receiverId, isRead: false }, { $set: { isRead: true } });
        res.sendStatus(200);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to mark as read' });
    }
}));
router.get('/hasUnread/:userId/:senderId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, senderId } = req.params;
    try {
        const hasUnread = yield messages_model_1.MessageModel.exists({
            senderId,
            receiverId: userId,
            isRead: false,
        });
        res.status(200).json({ hasUnread: !!hasUnread });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to check unread messages" });
    }
}));
exports.messagesRoute = router;
