import {z} from 'zod';



 const userValidationSchema = z.object({
    body: z.object({
       email: z.string().email('Invalid email address'),
       password: z.string().min(6, 'Password must be at least 6 characters long'),
       name: z.string().min(1, 'Name is required'),
       role: z.enum(['admin', 'agent', 'user']).default('user'),
       isOnline: z.boolean().default(false),
       isBlocked: z.boolean().default(false),
    })
 });

 const loginZodSchema = z.object({
   body: z.object({
     email: z.string({
       required_error: 'ID is required',
     }),
     password: z.string({
       required_error: 'Password is required',
     }),
   }),
 });
 
 export const UserValidation = {
    userValidationSchema,
    loginZodSchema
 };
 