import { Request, Response } from "express";
import { messagesServices } from "./messages_services";



const getMessages = async (req: Request, res: Response) => {
    const { user1, user2 } = req.params;
  
    try {
      const messages = await messagesServices.getMessagesBetweenUsers(user1, user2);
      res.status(200).json({
        success: true,
        data: messages,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve messages",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
};


export const messagesController = {
    getMessages
}
