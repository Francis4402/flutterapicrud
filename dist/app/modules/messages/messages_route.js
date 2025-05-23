"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesRoute = void 0;
const express_1 = require("express");
const messages_controller_1 = require("./messages_controller");
const router = (0, express_1.Router)();
router.post('/send', messages_controller_1.messagesController.sendMessage);
router.get('/:user1/:user2', messages_controller_1.messagesController.getMessages);
exports.messagesRoute = router;
