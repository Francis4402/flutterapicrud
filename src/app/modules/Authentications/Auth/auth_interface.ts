export interface IJwtPayload {
    userId: string;
    name: string;
    email: string;
    role: 'admin' | 'agent' | 'user';
    isBlocked: boolean;
}