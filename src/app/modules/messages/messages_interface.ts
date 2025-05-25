export type TMessage = {
    roomId: string;
    senderId: string;
    receiverId: string;
    message: string;
    image?: string;       // base64 string or image URL
    file?: string;        // base64 string or file URL
    fileName?: string;
    timestamp: string | Date;
  };