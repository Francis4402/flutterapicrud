import { TPost } from "./post_interface";
import { PostModel } from "./post_model";



const createPostIntoDB = async (postData: Partial<TPost>) => {

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