import { model, Schema } from "mongoose";
import { TMessage } from "./messages_interface";


const MessageSchema = new Schema<TMessage>({
    senderId: {
        type: String, required: true
    },
    receiverId: {
        type: String, required: true
    },
    message: {
        type: String, required: true
    },
  }, {
    timestamps: true,
  });

export const MessageModel = model<TMessage>('messages', MessageSchema);