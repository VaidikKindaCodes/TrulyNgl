import * as React from "react";

interface Props {
  username: string;
  resetLink: string;
}

export default function ResetPasswordEmail({ username, resetLink }: Props) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: 1.6 }}>
      <h2>Hello {username},</h2>
      <p>You requested to reset your password.</p>
      <p>
        Click the button below to reset it. This link will expire in 30 minutes.
      </p>
      <a
        href={resetLink}
        style={{
          display: "inline-block",
          padding: "10px 20px",
          backgroundColor: "#4f46e5",
          color: "#fff",
          borderRadius: "6px",
          textDecoration: "none",
        }}
      >
        Reset Password
      </a>
      <p>If you didn't request this, you can safely ignore this email.</p>
    </div>
  );
}
