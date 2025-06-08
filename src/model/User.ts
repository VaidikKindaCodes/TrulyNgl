import mongoose, { Schema, Document } from "mongoose";
import { string } from "zod";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  resetPasswordToken: string;
  resetTokenExpiry: Date;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "enter a username"],
    trim: true,
    unique: [true, "username is already taken"],
  },
  email: {
    type: String,
    required: [true, "enter an email id"],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "enter a valid email id"],
    unique: [true, "email is already in use"],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "enter a password"],
  },
  verifyCode: {
    type: String,
    required: [true, "enter the verification code to proceed"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "enter the verification code to proceed"],
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  isAcceptingMessages: {
    type: Boolean,
    required: true,
    default: true,
  },
  resetTokenExpiry:{
    type: Date,
    required: false,
  },
  resetPasswordToken: {
    type: String,
    required: false,
  },
  messages: {
    type: [MessageSchema],
  },
});

// Fix overwrite error here
const userModel = mongoose.models.User || mongoose.model("User", UserSchema);

export default userModel;
