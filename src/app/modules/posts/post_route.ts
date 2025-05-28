import { Router } from "express";
import { postController } from "./post_controller";
import validateRequest from "../../middlewares/validateRequest";
import { postValidationShcema } from "./post_validation";
import { multerUpload } from "../../config/multer.config";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user_constant";





const router = Router();

router.get('/', postController.getPosts);

router.post('/', multerUpload.fields([{name: 'images'}]), auth([USER_ROLE.admin, USER_ROLE.agent]), validateRequest(postValidationShcema), postController.createPost);

router.get('/:id', postController.getSinglePost);

router.put('/:id', auth([USER_ROLE.admin]), postController.updatePost, validateRequest(postValidationShcema));

router.delete('/:id', postController.deletePost);

export const postRoute = router;