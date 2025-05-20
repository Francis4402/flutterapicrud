import config from "../../config";
import { TUser } from "./user_interface";
import { User } from "./user_model";



const createUserIntoDB = async (payload: Partial<TUser>): Promise<TUser> => {
   payload.password = payload.password || (config.default_pass as string);
 
   payload.role = payload.role || "user";
 
   const result = await User.create(payload);
 
   return result;
};

const getUsersFromDB = async () => {
   const result = await User.find();
   return result;
}

export const UserServices = {
   createUserIntoDB, getUsersFromDB
}