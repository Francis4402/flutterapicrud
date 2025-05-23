import { Router } from "express";
import { messagesController } from "./messages_controller";


const router = Router();

router.post('/send', messagesController.sendMessage);

router.get('/:user1/:user2', messagesController.getMessages);

export const messagesRoute = router;