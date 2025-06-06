import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";



const notFound = (req: Request, res: Response, next: NextFunction) => {
  return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'Not Found',
      statusCode: StatusCodes.NOT_FOUND,
      error: '',
  });
};
  
  export default notFound;
  