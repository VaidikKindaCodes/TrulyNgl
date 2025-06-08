import DbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth/next"; // ✅ this fixes the type error

import { authOptions } from "../../auth/[...nextauth]/options";
import userModel from "@/model/User";
import { NextResponse } from "next/server";

export async function DELETE(
  context: { params: { id: string } }
) {
  await DbConnect();

  const session = await getServerSession(authOptions);


  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "No session found" },
      { status: 401 }
    );
  }

  const userId = (session.user as any)._id || (session.user as any).id;
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "User ID missing from session" },
      { status: 400 }
    );
  }

  const messageId = context.params.id;

  try {
    const result = await userModel.updateOne(
      { _id: userId },
      { $pull: { messages: { _id: messageId } } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Message not found or already deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Message deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { success: false, message: "Error deleting message" },
      { status: 500 }
    );
  }
}
