import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "@/components/email-template"
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_KEY);

export async function sendVerificationEmail(
    email : string,
    username : string,
    verifyCode :string,
):Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'TruelyNGL <Vaidik@vaidik.space>',
            to: [email],
            subject: 'verification code',
            react: VerificationEmail({username : username , otp : verifyCode}),
          });
        return {
            success : true,
            message : "verification email send succesfully"
        }
    } catch (error) {
        console.log("email error : " ,error);
        return {
            success : false,
            message : "failed to send verification email"
        }
    }
}