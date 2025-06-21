export interface IJwtPayload {
    userId: string;
    name: string;
    email: string;
    role: 'admin' | 'agent' | 'user';
    isOnline: boolean,
    isBlocked: boolean;
    lastSeen: Date;
}
