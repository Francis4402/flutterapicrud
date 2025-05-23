import { TMessage } from "./messages_interface";
import { MessageModel } from "./messages_model"




const createMessage = async (payload: TMessage) => {
    const newMessage = await MessageModel.create(payload);
    return newMessage;
};


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
    createMessage, getMessagesBetweenUsers
}