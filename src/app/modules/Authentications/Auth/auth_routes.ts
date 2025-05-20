import { NextFunction, Request, Response, Router } from "express";
import validateRequest from "../../../middlewares/validateRequest";
import { UserValidation } from "../../User/user_validation";
import { AuthController } from "./auth_controller";
import { UserController } from "../../User/user_controller";



const router = Router();

router.post('/login', validateRequest(UserValidation.loginZodSchema), AuthController.loginUser);

router.post('/register',
    validateRequest(UserValidation.userValidationSchema), 
    UserController.createUser
);

export const AuthRoutes = router;