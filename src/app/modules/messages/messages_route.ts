import { Router } from "express";
import { MessageModel } from "./messages_model";
import { messagesController } from "./messages_controller";


const router = Router();

router.get('/:user1/:user2', async (req, res) => {
    const { user1, user2 } = req.params;
    const roomId = `room_${[user1, user2].sort().join("_")}`;
  
    try {
      const messages = await MessageModel.find({ roomId }).sort({ timestamp: 1 });
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
});



export const messagesRoute = router;