import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/appError";
import { IImageFiles } from "../../interface/IImageFile";
import { TPost } from "./post_interface";
import { PostModel } from "./post_model";



const createPostIntoDB = async (postData: Partial<TPost>, postImages?: IImageFiles) => {

    const images = postImages?.images;

    if(!images || images.length === 0) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            'Post images are required'
        );
    };

    postData.imageUrls = images.map((image) => image.path);

    const newPost = new PostModel({
        ...postData,
    });

    const result = await newPost.save();

    return result;
}

const getPostsFromDB = async () => {

    const result = await PostModel.find({});

    return result;
}

const getSinglePostFromDB = async (id: string) => {
    const result = await PostModel.findOne({_id: id});

    return result;
}

const updatePostIntoDB = async (id: string, post: TPost) => {
    const result = await PostModel.findOneAndUpdate({_id: id}, post, {new: true});

    return result;
}

const deletePostFromDB = async (id: string) => {
    const result = await PostModel.findOneAndDelete({_id: id});

    return result;
}

export const postServices = {
    createPostIntoDB, getPostsFromDB, getSinglePostFromDB, updatePostIntoDB, deletePostFromDB
}