import {z} from "zod"

export const setUsernameSchema = z.object({
    username: z.string()
  .min(8, "username must be at least 8 characters")
  .max(16, "username can be at most 16 characters")
  .regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters')
})