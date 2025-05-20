"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const appError_1 = __importDefault(require("../../errors/appError"));
const post_model_1 = require("./post_model");
const createPostIntoDB = (postData, postImages) => __awaiter(void 0, void 0, void 0, function* () {
    const images = postImages === null || postImages === void 0 ? void 0 : postImages.images;
    if (!images || images.length === 0) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Post images are required');
    }
    ;
    postData.imageUrls = images.map((image) => image.path);
    const newPost = new post_model_1.PostModel(Object.assign({}, postData));
    const result = yield newPost.save();
    return result;
});
const getPostsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.PostModel.find({});
    return result;
});
const getSinglePostFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.PostModel.findOne({ _id: id });
    return result;
});
const updatePostIntoDB = (id, post) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.PostModel.findOneAndUpdate({ _id: id }, post, { new: true });
    return result;
});
const deletePostFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.PostModel.findOneAndDelete({ _id: id });
    return result;
});
exports.postServices = {
    createPostIntoDB, getPostsFromDB, getSinglePostFromDB, updatePostIntoDB, deletePostFromDB
};
