import { ApiResponse } from "@/types/ApiResponse";
import { Resend } from "resend";
import ResetPasswordEmail from "@/components/reset-password";

const resend = new Resend(process.env.RESEND_KEY);

export async function sendResetPasswordEmail(
  email: string,
  username: string,
  resetLink: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Reset your password",
      react: ResetPasswordEmail({ username, resetLink }),
    });

    return {
      success: true,
      message: "Reset password email sent successfully",
    };
  } catch (error) {
    console.log("Reset password email error:", error);
    return {
      success: false,
      message: "Failed to send reset password email",
    };
  }
}
