import { Request, Response } from "express";
import { messagesServices } from "./messages_services";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";



const getMessages = async (req: Request, res: Response) => {
    const { user1, user2 } = req.params;
  
    const messages = await messagesServices.getMessagesBetweenUsers(user1, user2);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Messages Retrieved',
      data: messages,
    });
};

const deleteMessage = catchAsync(async (req, res) => {
  
  const message = await messagesServices.deleteMessageFromDB(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Post Deleted',
    data: message,
  });
});


export const messagesController = {
    getMessages, deleteMessage
}
