import DbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { usernameValidationSchema } from "@/schemas/signupSchema";
import { z } from "zod";

const usernameQuerySchema = z.object({
  username: usernameValidationSchema,
});

export async function GET(request: Request) {
  await DbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    const result = usernameQuerySchema.safeParse(queryParam);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(', ')
              : 'Invalid query parameters',
        },
        { status: 400 }
      );
    }
    const { username } = result.data;

    const existingUser = await userModel.findOne({ username });
    if (existingUser) {
      return new Response(JSON.stringify({
          success: false,
          message: "username is already taken",
        }), { status: 400 });
    }
    return new Response(JSON.stringify({
        success: true,
        message: "username is available",
      }), { status: 200 });
  } catch (error) {
    console.log("error", error);
    return new Response(JSON.stringify({
        success: false,
        message: "error checking for username",
      }), { status: 500 });
  }
}