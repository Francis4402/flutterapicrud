import { Router } from "express";
import { postController } from "./post_controller";
import validateRequest from "../../middlewares/validateRequest";
import { postValidationShcema } from "./post_validation";



const router = Router();

router.get('/', postController.getPosts);

router.post('/', validateRequest(postValidationShcema), postController.createPost);

router.get('/:id', postController.getSinglePost);

router.put('/:id', validateRequest(postValidationShcema), postController.updatePost);

router.delete('/:id', postController.deletePost);

export const postRoute = router;