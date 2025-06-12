export type TMessage = {
    roomId: string;
    senderId: string;
    receiverId: string;
    message?: string;
    image?: string;
    file?: string;
    fileName?: string;
    isRead?: boolean;
    timestamp: string | Date;
};