import DbConnect from "@/lib/dbConnect";
import userModel, { Message } from "@/model/User";

type requestBody ={
    username : string;
    content: string;
}

export async function POST(request:Request) {
    await DbConnect();
    const {username , content} = await request.json() as requestBody;
    
    const senderUsername = request.headers.get("x-username");

    try {
        const user = await userModel.findOne({username});
        if(!user){
            return Response.json({
                success: false,
                message: "no user found"
            },{status: 404});
        }
        if(!user.isAcceptingMessages){
            return Response.json({
                success: false,
                message: "user is not accepting messages"
            },{status: 403});
        }

        if(senderUsername && senderUsername === username){
            return Response.json({
                success: false,
                message: "you cannot send a message to yourself"
            },{status: 400});
        }
        
        const newMessage = {content : content , createdAt : new Date()};
        user.messages.push(newMessage as Message);
        await user.save();
        return Response.json({
            success : true,
            message : "message sent successfully"
        },{status : 200});
    } catch (error) {
        console.log("error: " , error);
        return Response.json({
            success : false,
            message : "error sending message"
        },{status : 403});
    }
}