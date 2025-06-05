import { sendVerificationEmail } from "@/helper/sendVerificationCode";
import DbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import bcrypt from "bcryptjs";

async function POST(request: Request) {
  await DbConnect();
  try {
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return Response.json(
        {
          success: false,
          message: "invalid json",
        },
        { status: 400 }
      );
    }
    const { username, email, password } = body;

    const exisitingUserByUsername = await userModel.findOne({
      username: username,
    });
    if (exisitingUserByUsername) {
      return Response.json(
        {
          success: false,
          message: "username is already taken",
        },
        { status: 400 }
      );
    }
    const exisitingUserByEmail = await userModel.findOne({ email: email });
    const verifyCode = Math.floor(Math.random() * 90000 + 100000).toString();
    const verifyCodeExpiryDate = new Date();
    verifyCodeExpiryDate.setHours(verifyCodeExpiryDate.getHours() + 1);

    if (exisitingUserByEmail) {
      if (exisitingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "email is already in use",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        exisitingUserByEmail.password = hashedPassword;
        exisitingUserByEmail.verifyCode = verifyCode;
        exisitingUserByEmail.verifyCodeExpiry = verifyCodeExpiryDate;
        await exisitingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await userModel.create({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: verifyCodeExpiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });
    }
    const sendCode = await sendVerificationEmail(email, username, verifyCode);
    if (sendCode.success) {
      return Response.json(
        {
          success: true,
          message: "verify code sent successfully",
        },
        { status: 200 }
      );
    } else {
      return Response.json(
        {
          success: true,
          message: "error sending verification code",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.log(error);
    return Response.json(
        {
          success: false,
          message: "error registring user",
        },
        { status: 500 }
      );
  }
}

export default POST;
