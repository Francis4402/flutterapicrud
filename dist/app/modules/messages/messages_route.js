"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesRoute = void 0;
const express_1 = require("express");
const messages_controller_1 = require("./messages_controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user_constant");
const router = (0, express_1.Router)();
router.get('/', (0, auth_1.default)([user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.agent]), messages_controller_1.messagesController.getMessages);
router.get('/chatroom', (0, auth_1.default)([user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.agent]), messages_controller_1.messagesController.getChatRoom);
exports.messagesRoute = router;
