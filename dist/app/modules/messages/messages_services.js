"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.messageServices = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const chatHelper_1 = require("../../utils/chatHelper");
const messages_model_1 = require("./messages_model");
const user_model_1 = require("../User/user_model");
const createMessage = (messageData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = new messages_model_1.MessageModel({
            chatroomId: messageData.chatroomId,
            messageId: messageData.messageId,
            sender: messageData.sender,
            receiver: messageData.receiver,
            message: messageData.message,
            status: messageData.status || 'sent'
        });
        yield message.save();
        return message;
    }
    catch (error) {
        throw error;
    }
});
const fetchMessages = (_a) => __awaiter(void 0, [_a], void 0, function* ({ currentUserId, senderId, receiverId, page = 1, limit = 20 }) {
    const roomId = (0, chatHelper_1.getRoomId)(senderId, receiverId);
    const query = { chatroomId: roomId };
    try {
        if (currentUserId == receiverId) {
            const undeliveryQuery = {
                chatroomId: roomId,
                receiver: new mongoose_1.default.Types.ObjectId(currentUserId),
                sender: new mongoose_1.default.Types.ObjectId(senderId),
                status: 'sent'
            };
            const undeliveredUpdate = yield messages_model_1.MessageModel.updateMany(undeliveryQuery, {
                $set: {
                    status: 'delivered'
                }
            });
            if (undeliveredUpdate.modifiedCount > 0) {
                console.log(`Updated ${undeliveredUpdate.modifiedCount} messages to delivered`);
            }
            const messages = yield messages_model_1.MessageModel.aggregate([
                { $match: query }, // Match the query
                { $sort: { createdAt: -1 } }, // Sort by newest first
                { $skip: (page - 1) * limit }, // Pagination: skip
                { $limit: limit }, // Pagination: limit
                {
                    $addFields: {
                        isMine: {
                            $eq: ["$sender", { $toObjectId: currentUserId }]
                        }
                    }
                },
            ]);
            return messages.reverse();
        }
    }
    catch (error) {
        throw new Error('Failed to retrive messages');
    }
});
const updateMessageStatus = (_a) => __awaiter(void 0, [_a], void 0, function* ({ messageId, status }) {
    try {
        const message = yield messages_model_1.MessageModel.findByIdAndUpdate({ messageId: messageId }, { status: status }, { new: true });
        return message;
    }
    catch (error) {
        throw error;
    }
});
const updateUserLastSeen = (userId, lastSeen) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findOneAndUpdate(userId, { lastSeen: lastSeen }, { new: true });
        return user;
    }
    catch (error) {
        throw error;
    }
});
const markMessageAsDelivered = (userId, partnerId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield messages_model_1.MessageModel.updateMany({
            receiver: new mongoose_1.Types.ObjectId(userId),
            sender: new mongoose_1.Types.ObjectId(partnerId),
            status: { $in: ['sent', 'delivered'] },
        }, { $set: { status: 'read' } });
        return result.modifiedCount;
    }
    catch (error) {
        throw error;
    }
});
const getUserLastSeen = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(userId).select('lastSeen');
        if (!user) {
            return null;
        }
        return user.lastSeen ? user.lastSeen.toISOString() : null;
    }
    catch (error) {
        throw error;
    }
});
const getUserOnlineStatus = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(userId).select('isOnline lastSeen');
        if (!user) {
            return { isOnline: false, lastSeen: null };
        }
        return {
            isOnline: user.isOnline || false,
            lastSeen: user.lastSeen ? user.lastSeen.toISOString() : null
        };
    }
    catch (error) {
        throw error;
    }
});
const chatRoom = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userObjectId = new mongoose_1.Types.ObjectId(userId);
        const privateChatQuery = {
            $or: [{ sender: userObjectId }, { receiver: userObjectId }]
        };
        const privateChats = yield messages_model_1.MessageModel.aggregate([
            { $match: privateChatQuery },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $ne: ['$sender', userObjectId] },
                            '$sender',
                            '$receiver'
                        ]
                    },
                    latestMessageTime: { $first: '$createdAt' },
                    latestMessage: { $first: '$message' },
                    senderId: { $first: '$sender' },
                    messages: {
                        $push: {
                            sender: '$sender',
                            receiver: '$receiver',
                            status: '$status'
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            { $unwind: '$userDetails' },
            {
                $project: {
                    _id: 0,
                    chatType: 'private',
                    messageId: null, // You never defined a specific message ID field
                    username: '$userDetails.username',
                    userId: '$userDetails._id',
                    latestMessageTime: 1,
                    latestMessage: 1,
                    senderId: 1,
                    unreadCount: {
                        $size: {
                            $filter: {
                                input: '$messages',
                                as: 'msg',
                                cond: {
                                    $and: [
                                        { $eq: ['$$msg.receiver', userObjectId] },
                                        { $in: ['$$msg.status', ['sent', 'delivered']] }
                                    ]
                                }
                            }
                        }
                    },
                    latestMessageStatus: {
                        $cond: [
                            { $eq: ['$senderId', userObjectId] },
                            {
                                $arrayElemAt: [
                                    {
                                        $map: {
                                            input: {
                                                $filter: {
                                                    input: '$messages',
                                                    as: 'msg',
                                                    cond: {
                                                        $eq: ['$$msg.sender', userObjectId]
                                                    }
                                                }
                                            },
                                            as: 'msg',
                                            in: '$$msg.status'
                                        }
                                    },
                                    0
                                ]
                            },
                            null
                        ]
                    }
                }
            }
        ]);
        return privateChats.sort((a, b) => new Date(b.latestMessageTime).getTime() -
            new Date(a.latestMessageTime).getTime());
    }
    catch (error) {
        throw error;
    }
});
exports.messageServices = {
    createMessage,
    fetchMessages,
    updateMessageStatus,
    updateUserLastSeen,
    markMessageAsDelivered,
    getUserLastSeen,
    getUserOnlineStatus,
    chatRoom
};
