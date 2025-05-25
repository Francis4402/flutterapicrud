import { MessageModel } from "./messages_model"



const getMessagesBetweenUsers = async (
    userId1: string,
    userId2: string
  ) => {
    const messages = await MessageModel.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
    }).sort({ createdAt: 1 });
  
    return messages;
};


export const messagesServices = {
    getMessagesBetweenUsers
}