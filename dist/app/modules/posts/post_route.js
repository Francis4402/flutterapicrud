"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRoute = void 0;
const express_1 = require("express");
const post_controller_1 = require("./post_controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const post_validation_1 = require("./post_validation");
const router = (0, express_1.Router)();
router.get('/', post_controller_1.postController.getPosts);
router.post('/', (0, validateRequest_1.default)(post_validation_1.postValidationShcema), post_controller_1.postController.createPost);
router.get('/:id', post_controller_1.postController.getSinglePost);
router.put('/:id', post_controller_1.postController.updatePost, (0, validateRequest_1.default)(post_validation_1.postValidationShcema));
router.delete('/:id', post_controller_1.postController.deletePost);
exports.postRoute = router;
