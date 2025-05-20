import { Model } from "mongoose";
import { USER_ROLE } from "./user_constant";


export type TUser = {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'agent' | 'user';
    isBlocked: boolean;
}

export interface UserModel extends Model<TUser> {
    isUserExistsByCustomId(email: string): Promise<TUser>;
    isPasswordMatched(plainTextPassword: string, hashedPassword: string): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;