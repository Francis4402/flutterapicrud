import { StatusCodes } from "http-status-codes";
import AppError from "../../../errors/appError";
import { createToken, verifyToken } from "./auth_utils";
import config from "../../../config";
import { User } from "../../User/user_model";
import { TUser } from "../../User/user_interface";




const loginUserFromDB = async (userData: TUser) => {
    const user = await User.findOne({email: userData.email});

    if(!user) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
    }
    
    const isBlocked = user.isBlocked;

    if(isBlocked === true) {
        throw new AppError(StatusCodes.FORBIDDEN, 'Your account is blocked !');
    }

    if(! await User.isPasswordMatched(userData?.password, user?.password))
        throw new AppError(StatusCodes.UNAUTHORIZED, 'Password do not matched!');

    const jwtPayload = {
        useremail: user.email,
        role: user.role,
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
}


const refreshToken = async (token: string) => {
    const decoded = verifyToken(token, config.jwt_refresh_secret as string);

    const { useremail } = decoded;

    const user = await User.findOne({email: useremail});

    if(!user) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
    }

    const isBlocked = user.isBlocked;

    if(isBlocked === true) {
        throw new AppError(StatusCodes.FORBIDDEN, 'Your account is blocked !');
    }

    const jwtPayload = {
        useremail: user.email,
        role: user.role,
      };
    
      const accessToken = createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_access_expires_in as string,
      );

      return {
        accessToken,
      }
}

export const AuthService = {
    loginUserFromDB,
    refreshToken
}