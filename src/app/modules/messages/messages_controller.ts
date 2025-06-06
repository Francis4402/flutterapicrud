import { messagesServices } from "./messages_services";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";



const getMessages = catchAsync( async (req, res)  => {
    const { user1, user2 } = req.params;
  
    const messages = await messagesServices.getMessagesBetweenUsers(user1, user2);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Messages Retrieved',
      data: messages,
    });
});



export const messagesController = {
    getMessages
}
