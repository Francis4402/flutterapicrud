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
exports.messagesServices = void 0;
const messages_model_1 = require("./messages_model");
const createMessage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newMessage = yield messages_model_1.MessageModel.create(payload);
    return newMessage;
});
const getMessagesBetweenUsers = (userId1, userId2) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield messages_model_1.MessageModel.find({
        $or: [
            { senderId: userId1, receiverId: userId2 },
            { senderId: userId2, receiverId: userId1 },
        ],
    }).sort({ createdAt: 1 });
    return messages;
});
exports.messagesServices = {
    createMessage, getMessagesBetweenUsers
};
