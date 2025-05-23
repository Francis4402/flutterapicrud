import { Router } from "express";
// import auth from "../../middlewares/auth";
// import { USER_ROLE } from "./user_constant";
import { UserController } from "./user_controller";



const router = Router();

router.get('/', UserController.getUsers);

export const UserRoutes = router;