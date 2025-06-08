import DbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession, User } from "next-auth";

type requestBody = {
  isAcceptingMessages: boolean;
};

export async function POST(request: Request) {
  await DbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as unknown as User;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "no user in session",
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
      console.log("cannot update user");
      return Response.json(
        {
          success: false,
          message: "no user in session",
        },
        {
          status: 401,
        }
      );
    }
    return Response.json(
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
    return Response.json(
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

export async function GET() {
    await DbConnect();
    const session  = await getServerSession(authOptions);
    const user : User= session?.user as unknown as User;
    if(!session || !session.user){
        return Response.json({
            success : false,
            message : "no user in session"
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
        return Response.json({
            success : false,
            message : "user not found"
        },
        {
            status : 404,
        })
        }
        return Response.json({
        success : true,
        isAcceptingMessages : foundUser.isAcceptingMessages
        },
        {
        status : 200,
        })
    } catch (error) {
        console.log("error : " , error);
        return Response.json({
            success : false,
            message : "error while getting user status for accepting message"
        },
        {
            status : 400,
        })
    }
}
