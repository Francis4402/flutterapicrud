"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_constant_1 = require("./user_constant");
const user_controller_1 = require("./user_controller");
const user_validation_1 = require("./user_validation");
const router = (0, express_1.Router)();
router.get('/', (0, auth_1.default)([user_constant_1.USER_ROLE.admin]), (0, validateRequest_1.default)(user_validation_1.UserValidation.userValidationSchema), user_controller_1.UserController.getUsers);
exports.UserRoutes = router;
