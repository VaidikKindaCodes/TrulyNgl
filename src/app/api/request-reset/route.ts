import DbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { sendResetPasswordEmail } from "@/helper/sendResetPasswordEmail";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  await DbConnect();
  const { email } = await req.json();
  const user = await userModel.findOne({ email });
  if (!user) return Response.json({});

  const token = uuidv4();
  user.resetPasswordToken = token;
  user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 30);
  await user.save();

  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  await sendResetPasswordEmail(user.email, user.username, resetLink);

  return Response.json({ success: true });
}
