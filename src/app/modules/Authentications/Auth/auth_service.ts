import { StatusCodes } from "http-status-codes";
import AppError from "../../../errors/appError";
import { createToken, verifyToken } from "./auth_utils";
import config from "../../../config";
import { User } from "../../User/user_model";
import { TUser } from "../../User/user_interface";
import mongoose from "mongoose";
import { IJwtPayload } from "./auth_interface";





const loginUserFromDB = async (userData: TUser) => {

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const user = await User.findOne({ email: userData.email }).session(
            session
        );

        if (!user) {
            throw new AppError(StatusCodes.NOT_FOUND, 'This user is not found!');
         }

        const isBlocked = user.isBlocked;

        if(isBlocked === true) {
            throw new AppError(StatusCodes.FORBIDDEN, 'Your account is blocked !');
        }

        if(! await User.isPasswordMatched(userData?.password, user?.password))
            throw new AppError(StatusCodes.UNAUTHORIZED, 'Password do not matched!');

        const jwtPayload: IJwtPayload = {
            userId: user._id.toString(),
            name: user.name as string,
            email: user.email as string,
            role: user.role as 'admin' | 'agent' | 'user',
            isBlocked: user.isBlocked as boolean,
        };

        const accessToken = createToken(
            jwtPayload,
            config.jwt_secret as string,
            config.jwt_access_expires_in as string,
        );

        const refreshToken = createToken(
            jwtPayload,
            config.jwt_refresh_secret as string,
            config.jwt_refresh_expires_in as string,
        );

        return {accessToken, refreshToken};
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
}


const refreshToken = async (token: string) => {

    let verifiedToken = null;
    try {
       verifiedToken = verifyToken(
          token,
          config.jwt_refresh_secret as string
       );
    } catch (err) {
       throw new AppError(StatusCodes.FORBIDDEN, 'Invalid Refresh Token');
    }
 
    const { userId } = verifiedToken;
 
    const isUserExist = await User.findById(userId);

    if (!isUserExist) {
       throw new AppError(StatusCodes.NOT_FOUND, 'User does not exist');
    }
    const isBlocked = isUserExist.isBlocked;

    if(isBlocked === true) {
        throw new AppError(StatusCodes.FORBIDDEN, 'Your account is blocked !');
    }
 
 
    const jwtPayload: IJwtPayload = {
        userId: isUserExist._id.toString(),
        name: isUserExist.name as string,
        email: isUserExist.email as string,
        role: isUserExist.role as 'admin' | 'agent' | 'user',
        isBlocked: isUserExist.isBlocked as boolean,
    };
 
    const newAccessToken = createToken(
       jwtPayload,
       config.jwt_secret as string,
       config.jwt_access_expires_in as string
    );
 
    return {
       accessToken: newAccessToken,
    };
 };

export const AuthService = {
    loginUserFromDB,
    refreshToken
}