import DbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import userModel from "@/model/User";

export async function GET(request: Request) {
  await DbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "no session found",
      },
      { status: 404 }
    );
  }

  try {
    const userId = user._id;
    const userResult = await userModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      {
        $group: {
          _id: "$_id",
          messages: { $push: "$messages" },
        },
      },
    ]);
    if (!userResult) {
      return Response.json(
        {
          success: false,
          message: "no user found",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        messages: userResult[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("error getting messages:", error);
    return Response.json(
      {
        success: false,
        message: "Error getting messages",
      },
      {
        status: 500,
      }
    );
  }
}
