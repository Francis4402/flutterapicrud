import { Router } from "express";
import validateRequest from "../../../middlewares/validateRequest";
import { UserValidation } from "../../User/user_validation";
import { AuthController } from "./auth_controller";
import { UserController } from "../../User/user_controller";
import auth from "../../../middlewares/auth";
import { USER_ROLE } from "../../User/user_constant";



const router = Router();

router.post('/login', validateRequest(UserValidation.loginZodSchema), AuthController.loginUser);

router.post('/register',
    validateRequest(UserValidation.userValidationSchema), 
    UserController.createUser
);

router.post('/refresh-token', AuthController.refreshToken);

router.post('/change-password', auth([USER_ROLE.admin, USER_ROLE.agent, USER_ROLE.user]), AuthController.changePassword);

router.post('/forgot-password', AuthController.forgotPassword);

router.post('/reset-password', AuthController.resetPassword);

export const AuthRoutes = router;