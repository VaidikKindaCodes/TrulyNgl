import { NextRequest, NextResponse } from "next/server";
import DbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession, User } from "next-auth";

type requestBody = {
  isAcceptingMessages: boolean;
};
export async function POST(request: NextRequest) {
  await DbConnect();
  const session = await getServerSession(authOptions);
  const user: User & { _id?: string } = session?.user as unknown as User & { _id?: string };
  if (!session || !session.user || !user._id) {
    return NextResponse.json(
      {
        success: false,
        message: "no user in session or missing user id",
      },
      { status: 401 }
    );
  }

  try {
    const userId = user._id;
    const body = (await request.json()) as requestBody;
    const { isAcceptingMessages } = body;
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: userId },
      { isAcceptingMessages: isAcceptingMessages },
      { new: true }
    ); 
    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "user not found or could not be updated",
        },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "user updated",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("error :", error);
    return NextResponse.json(
      {
        success: false,
        message: "failed to update user status",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: NextRequest) {
    await DbConnect();
    const session  = await getServerSession(authOptions);
    const user : User & { _id?: string } = session?.user as unknown as User & { _id?: string };
    if(!session || !session.user || !user._id){
        return NextResponse.json({
            success : false,
            message : "no user in session or missing user id"
        },
    {
        status : 401,
    })
    }
    const userId = user._id;
    try {
        const foundUser = await userModel.findById(userId);
        if(!foundUser){
        console.log("cannot find the user");
        return NextResponse.json({
            success : false,
            message : "user not found"
        },
        {
            status : 404,
        })
        }
        return NextResponse.json({
        success : true,
        isAcceptingMessages : foundUser.isAcceptingMessages
        },
        {
        status : 200,
        })
    } catch (error) {
        console.log("error : " , error);
        return NextResponse.json({
            success : false,
            message : "error while getting user status for accepting message"
        },
        {
            status : 400,
        })
    }
}
