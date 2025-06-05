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
      return Response.json(
        {
          success: false,
          message: "error getting username",
        },
        { status: 400 }
      );
    }
    const { username } = result.data;

    const exisitingUser = await userModel.findOne({
      username,
    });
    if (exisitingUser) {
      return Response.json(
        {
          success: false,
          message: "username is already taken",
        },
        { status: 400 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "username is unique",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error", error);
    return Response.json(
      {
        success: false,
        message: "error checking for username",
      },
      {
        status: 500,
      }
    );
  }
}
