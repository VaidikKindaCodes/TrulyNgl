import {z} from "zod";

export const usernameValidationSchema = z.string().min(8, "username must be atleast 8 characters").max(16 , "username can atmost be 16 characters").regex(/^[a-zA-Z][a-zA-Z0-9_]{2,19}$/,"speacial characters are not allowed");


export const signupSchema = z.object({
    username: usernameValidationSchema,
    email: z.string(),
    password: z.string().min(6 , "password must be atleast 6 characters"),
})