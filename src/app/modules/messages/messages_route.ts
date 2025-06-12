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



router.patch('/read/:senderId/:receiverId', async (req, res) => {
  const { senderId, receiverId } = req.params;
  try {
    await MessageModel.updateMany(
      { senderId, receiverId, isRead: false },
      { $set: { isRead: true } }
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

router.get('/hasUnread/:userId/:senderId', async (req, res) => {
  const { userId, senderId } = req.params;

  try {
      const hasUnread = await MessageModel.exists({
          senderId,
          receiverId: userId,
          isRead: false,
      });

      res.status(200).json({ hasUnread: !!hasUnread });
  } catch (error) {
      res.status(500).json({ error: "Failed to check unread messages" });
  }
});


export const messagesRoute = router;