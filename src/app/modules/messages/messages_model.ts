import { model, Schema } from "mongoose";
import { TMessage } from "./messages_interface";


const MessageSchema = new Schema<TMessage>({
    roomId: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: false,
    },
    image: {
        type: String,
        required: false,
    },
    file: {
      type: String,
      required: false,
    },
    fileName: {
        type: String,
        required: false,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  });

export const MessageModel = model<TMessage>('messages', MessageSchema);