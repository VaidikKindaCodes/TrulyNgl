import DbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import userModel from "@/model/User";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  await DbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "No session found" },
      { status: 400 }
    );
  }

  const user = session.user as unknown as User;
  const messageId = await params.id;

  if (!user._id) {
    return Response.json(
      { success: false, message: "User ID missing from session" },
      { status: 400 }
    );
  }

  try {
    const result = await userModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (result.modifiedCount === 0) {
      return Response.json(
        { success: false, message: "Message not found or already deleted" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, message: "Message deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    return Response.json(
      { success: false, message: "Error deleting message" },
      { status: 500 }
    );
  }
}
