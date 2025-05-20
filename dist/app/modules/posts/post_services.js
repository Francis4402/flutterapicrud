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
Object.defineProperty(exports, "__esModule", { value: true });
exports.postServices = void 0;
const post_model_1 = require("./post_model");
const createPostIntoDB = (postData) => __awaiter(void 0, void 0, void 0, function* () {
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
