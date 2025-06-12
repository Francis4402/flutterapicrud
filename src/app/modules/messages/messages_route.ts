import { Router } from "express";
import { MessageModel } from "./messages_model";



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



router.get('/unreadCount/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    
    const unreadCount = await MessageModel.countDocuments({
      receiverId: userId,
      isRead: false,
    });

    res.status(200).json({ unreadCount });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch unread messages count" });
  }
});


export const messagesRoute = router;