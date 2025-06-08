import DbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import userModel from "@/model/User";
import { NextResponse, NextRequest } from "next/server";

export async function DELETE(
  req: NextRequest,  
  { params }: { params: { id: string } }  
) {
  await DbConnect();
  const ihatethisgame = await req.json();
  const session = await getServerSession(authOptions); // ✅ no req needed
  if(ihatethisgame){
  }

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "No session found" },
      { status: 401 }
    );
  }

  const userId = (session.user as any)._id || (session.user as any).id;
  const messageId = params.id;

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "User ID missing from session" },
      { status: 400 }
    );
  }

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
