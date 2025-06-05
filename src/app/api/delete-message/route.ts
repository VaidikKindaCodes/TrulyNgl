import DbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import userModel from "@/model/User";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await DbConnect();
  const messageId = params.id;
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "no session found",
      },
      { status: 400 }
    );
  }
  try {
    const result = await userModel.updateOne(
      { _id: user._id },
      {
        $pull: { messages: { _id: messageId } },
      }
    );
    if (result.modifiedCount == 0) {
      return Response.json(
        {
          success: false,
          message: "message not found or already deleted",
        },
        {
          status: 404,
        }
      );
    }
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "error deleting message",
      },
      {
        status: 401,
      }
    );
  }
}
