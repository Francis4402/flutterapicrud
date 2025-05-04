import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { postServices } from "./post_services";
import { IImageFiles } from "../../interface/IImageFile";


const createPost = catchAsync(async (req, res) => {
    
    const result = await postServices.createPostIntoDB(req.body, req.files as IImageFiles);

    console.log(result);

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: 'Post Created',
        data: result,
    });
});

const getPosts = catchAsync(async (req, res) => {

    const result = await postServices.getPostsFromDB();
    console.log(result);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Posts Retrieved',
        data: result,
    });
});

const getSinglePost = catchAsync(async (req, res) => {

    const result = await postServices.getSinglePostFromDB(req.params.id);
    console.log(result);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Post Retrieved',
        data: result,
    });
});

const updatePost = catchAsync(async (req, res) => {

    const result = await postServices.updatePostIntoDB(req.params.id, req.body);
    console.log(result);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Post Updated',
        data: result,
    });
});

const deletePost = catchAsync(async (req, res) => {

    const result = await postServices.deletePostFromDB(req.params.id);
    console.log(result);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Post Deleted',
        data: result,
    });
});


export const postController = {
    createPost, getPosts, getSinglePost, updatePost, deletePost
}