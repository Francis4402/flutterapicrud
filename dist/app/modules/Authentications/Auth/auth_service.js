"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const http_status_codes_1 = require("http-status-codes");
const appError_1 = __importDefault(require("../../../errors/appError"));
const auth_utils_1 = require("./auth_utils");
const config_1 = __importDefault(require("../../../config"));
const user_model_1 = require("../../User/user_model");
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const loginUserFromDB = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const user = yield user_model_1.User.findOne({ email: userData.email }).session(session);
        if (!user) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'This user is not found!');
        }
        const isBlocked = user.isBlocked;
        if (isBlocked === true) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Your account is blocked !');
        }
        if (!(yield user_model_1.User.isPasswordMatched(userData === null || userData === void 0 ? void 0 : userData.password, user === null || user === void 0 ? void 0 : user.password)))
            throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Password do not matched!');
        const jwtPayload = {
            userId: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            isBlocked: user.isBlocked,
        };
        const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_secret, config_1.default.jwt_access_expires_in);
        const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
        return { accessToken, refreshToken };
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        yield session.endSession();
    }
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let verifiedToken = null;
    try {
        verifiedToken = (0, auth_utils_1.verifyToken)(token, config_1.default.jwt_refresh_secret);
    }
    catch (err) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Invalid Refresh Token');
    }
    const { userId } = verifiedToken;
    const isUserExist = yield user_model_1.User.findById(userId);
    if (!isUserExist) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User does not exist');
    }
    const isBlocked = isUserExist.isBlocked;
    if (isBlocked === true) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Your account is blocked !');
    }
    const jwtPayload = {
        userId: isUserExist._id.toString(),
        name: isUserExist.name,
        email: isUserExist.email,
        role: isUserExist.role,
        isBlocked: isUserExist.isBlocked,
    };
    const newAccessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_secret, config_1.default.jwt_access_expires_in);
    return {
        accessToken: newAccessToken,
    };
});
const changePassword = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = userData;
    const { oldPassword, newPassword } = payload;
    const user = yield user_model_1.User.findOne({ _id: userId });
    if (!user) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    }
    if (user.isBlocked) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'User account is Blocked');
    }
    const isOldPasswordCorrect = yield user_model_1.User.isPasswordMatched(oldPassword, user.password);
    if (!isOldPasswordCorrect) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Incorrect old password');
    }
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
    yield user_model_1.User.updateOne({ _id: userId }, { password: hashedPassword });
    return { message: 'Password changed successfully' };
});
const forgotPassword = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email }) {
    const user = yield user_model_1.User.findOne({ email: email });
    if (!user) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    }
    if (user.isBlocked) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'User is blocked!');
    }
    const resetToken = (0, auth_utils_1.createToken)({
        userId: user._id.toString(),
        email: user.email
    }, config_1.default.jwt_secret, '1h');
    return {
        status: 'success',
        message: 'Password reset token generated',
        data: {
            resetToken
        }
    };
});
const resetPassword = (_a) => __awaiter(void 0, [_a], void 0, function* ({ token, newPassword }) {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const decodedData = (0, auth_utils_1.verifyToken)(token, config_1.default.jwt_secret);
        const user = yield user_model_1.User.findOne({
            email: decodedData.email,
            _id: decodedData.userId
        }).session(session);
        if (!user) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
        }
        if (user.isBlocked) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'User is blocked!');
        }
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
        yield user_model_1.User.updateOne({ _id: user._id }, { password: hashedPassword }).session(session);
        yield session.commitTransaction();
        return {
            message: 'Password reset successfully',
        };
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
exports.AuthService = {
    loginUserFromDB,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
};
