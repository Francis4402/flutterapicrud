import { NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/appError";
import { StatusCodes } from "http-status-codes";


export const parseBody = catchAsync(async (req, res, next: NextFunction) => {
    if (!req.body.data) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Please provide data in the body under data key');
    }
    req.body = JSON.parse(req.body.data);

    next();
});