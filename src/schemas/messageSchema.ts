import {z} from "zod";

export const messageSchema = z.object({
    content: z.string().min(6 , "message must be atleast 6 characters").max(100 , "message cannot exceed length of 100")
});
