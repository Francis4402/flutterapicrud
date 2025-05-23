import { Request, Response } from "express";
import { messagesServices } from "./messages_services";


const sendMessage = async (req: Request, res: Response) => {
    try {
      const message = await messagesServices.createMessage(req.body);
      res.status(201).json({
        success: true,
        data: message,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to send message",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
};

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
    sendMessage, getMessages
}
