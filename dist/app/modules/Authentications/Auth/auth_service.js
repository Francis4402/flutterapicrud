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
const loginUserFromDB = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: userData.email });
    if (!user) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid credentials');
    }
    const isBlocked = user.isBlocked;
    if (isBlocked === true) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Your account is blocked !');
    }
    if (!(yield user_model_1.User.isPasswordMatched(userData === null || userData === void 0 ? void 0 : userData.password, user === null || user === void 0 ? void 0 : user.password)))
        throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Password do not matched!');
    const jwtPayload = {
        useremail: user.email,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return { accessToken, refreshToken };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.jwt_refresh_secret);
    const { useremail } = decoded;
    const user = yield user_model_1.User.findOne({ email: useremail });
    if (!user) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid credentials');
    }
    const isBlocked = user.isBlocked;
    if (isBlocked === true) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Your account is blocked !');
    }
    const jwtPayload = {
        useremail: user.email,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_access_expires_in);
    return {
        accessToken,
    };
});
exports.AuthService = {
    loginUserFromDB,
    refreshToken
};
