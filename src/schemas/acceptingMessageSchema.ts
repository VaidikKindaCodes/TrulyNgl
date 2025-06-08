import {z} from "zod";

export const acceptingSchema = z.object({
    isAccepting : z.boolean(),
})