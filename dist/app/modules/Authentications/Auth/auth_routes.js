"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const user_validation_1 = require("../../User/user_validation");
const auth_controller_1 = require("./auth_controller");
const user_controller_1 = require("../../User/user_controller");
const router = (0, express_1.Router)();
router.post('/login', (0, validateRequest_1.default)(user_validation_1.UserValidation.loginZodSchema), auth_controller_1.AuthController.loginUser);
router.post('/register', (0, validateRequest_1.default)(user_validation_1.UserValidation.userValidationSchema), user_controller_1.UserController.createUser);
router.post('/refresh-token', auth_controller_1.AuthController.refreshToken);
exports.AuthRoutes = router;
