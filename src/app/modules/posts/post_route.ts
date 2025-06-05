import { Router } from "express";
import { postController } from "./post_controller";
import validateRequest from "../../middlewares/validateRequest";
import { postValidationShcema } from "./post_validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user_constant";


const router = Router();

router.get('/', postController.getPosts);

router.post('/', auth([USER_ROLE.admin, USER_ROLE.agent]), validateRequest(postValidationShcema), postController.createPost);

router.get('/:id', auth([USER_ROLE.admin, USER_ROLE.agent]), postController.getSinglePost);

router.put('/:id', auth([USER_ROLE.admin, USER_ROLE.agent]), validateRequest(postValidationShcema), postController.updatePost);

router.delete('/:id', auth([USER_ROLE.admin, USER_ROLE.agent]), postController.deletePost);

export const postRoute = router;