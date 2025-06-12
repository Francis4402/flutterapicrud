import { StatusCodes } from "http-status-codes";
import config from "../../../config";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { AuthService } from "./auth_service";



const loginUser = catchAsync(async (req, res) => {
    const result = await AuthService.loginUserFromDB(req.body);
    const { refreshToken, accessToken } = result;

    res.cookie('refreshToken', refreshToken, {
        secure: config.node_env === 'production',
        httpOnly: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    sendResponse(res, {
        success: true,
        message: 'Login successful',
        statusCode: StatusCodes.OK,
        data: {
            accessToken,
            refreshToken
        },
    })
});


const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return sendResponse(res, {
            statusCode: StatusCodes.UNAUTHORIZED,
            success: false,
            message: 'Refresh token is missing or invalid',
            data: null,
        });
    }

    const result = await AuthService.refreshToken(refreshToken);
    if (!result) {
        return sendResponse(res, {
            statusCode: StatusCodes.UNAUTHORIZED,
            success: false,
            message: 'Invalid refresh token',
            data: null,
        });
    }

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Access token is retrieved succesfully!',
        data: result,
    });
});

const changePassword = catchAsync(async (req, res) => {
    const user = req.user;
    const payload = req.body;
  
    await AuthService.changePassword(user, payload);
  
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Password changed successfully!",
      data: null,
    });
});

const forgotPassword = catchAsync(async (req, res) => {
    await AuthService.forgotPassword(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Password reset token generated successfully!',
        data: null,
    });
});

const resetPassword = catchAsync(async (req, res) => {

    const payload = req.body;
  
    const result = await AuthService.resetPassword(payload);
  
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Password reset successfully!",
      data: result,
    });
});

export const AuthController = {
    loginUser,
    refreshToken,
    resetPassword,
    changePassword,
    forgotPassword
}