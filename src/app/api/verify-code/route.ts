import DbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";

type requestBody = {
  username: string;
  verifyCode: string;
};

export async function POST(request: Request) {
  await DbConnect();
  try {
    const body = (await request.json()) as requestBody;
    const { username, verifyCode } = body;
    const user = await userModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "no user found",
        },
        { status: 404 }
      );
    }
    console.log(verifyCode);
        const isCodeValid = user.verifyCode == verifyCode;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry)  > new Date();

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true
            await user.save();
            return Response.json({
                success : true,
                message : "user is verified"
            },{status : 200});
        }
        if(!isCodeNotExpired){
            return Response.json({
                success : false,
                message : "code has expired"
            },{status : 400});
        }
        if(!isCodeValid){
            return Response.json({
                success : false,
                message : "invalid code"
            },{status : 400});
        }
  } catch (error) {
    console.log("error verifying user: ", error);
    return Response.json(
      {
        success: false,
        message: "error verifying user",
      },
      { status: 500 }
    );
  }
}
