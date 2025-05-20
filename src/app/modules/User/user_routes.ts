import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "./user_constant";
import { UserController } from "./user_controller";
import { UserValidation } from "./user_validation";



const router = Router();

router.get('/', auth([USER_ROLE.admin]), validateRequest(UserValidation.userValidationSchema), UserController.getUsers);

export const UserRoutes = router;