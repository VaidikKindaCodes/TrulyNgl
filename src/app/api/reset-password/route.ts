import DbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await DbConnect();
  const { token, password } = await req.json();

  const user = await userModel.findOne({resetPasswordToken: token})

  if (!user) {
    return Response.json({ message: "Invalid or expired token" }, { status: 400 });
  }

  user.password = await bcrypt.hash(password, 12);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return Response.json({ message: "Password reset successful" });
}
