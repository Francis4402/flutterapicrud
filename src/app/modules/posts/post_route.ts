import { Router } from "express";
import { postController } from "./post_controller";
import validateRequest from "../../middlewares/validateRequest";
import { postValidationShcema } from "./post_validation";
import { multerUpload } from "../../config/multer.config";
import { parseBody } from "../../middlewares/bodyParser";


const router = Router();

router.get('/', postController.getPosts);

router.post('/', multerUpload.fields([{ name: 'images' }]), parseBody, validateRequest(postValidationShcema), postController.createPost);

router.get('/:id', postController.getSinglePost);

router.put('/:id', postController.updatePost, validateRequest(postValidationShcema));

router.delete('/:id', postController.deletePost);

export const postRoute = router;