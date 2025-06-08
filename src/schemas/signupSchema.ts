import {z} from "zod";

export const usernameValidationSchema = z
  .string()
  .min(8, "username must be at least 8 characters")
  .max(16, "username can be at most 16 characters")
  .regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters');


export const signupSchema = z.object({
    username: usernameValidationSchema,
    email: z.string(),
    password: z.string().min(6 , "password must be atleast 6 characters"),
})