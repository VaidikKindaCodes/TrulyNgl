import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import userModel from "@/model/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession({ req, ...authOptions });

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { username } = await req.json();

  // Check if username is already taken
  const existingUser = await userModel.findOne({ username });
  if (existingUser) {
    return NextResponse.json({ success: false, message: "Username already taken" }, { status: 400 });
  }

  // Update user in DB
  await userModel.findOneAndUpdate(
    { email: session.user.email },
    { username },
    { new: true }
  );

  return NextResponse.json({ success: true, message: "Username updated" });
}
