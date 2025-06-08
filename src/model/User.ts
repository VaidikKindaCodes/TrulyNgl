import mongoose, { Schema, Document } from "mongoose";

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
    default: Date.now,
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
  messages: Message[];
  provider: string;
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: false,
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
    required: false
  },
  verifyCode: {
    type: String,
    required: false,
  },
  verifyCodeExpiry: {
    type: Date,
    required: false
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
  messages: {
    type: [MessageSchema],
  },
  provider: {
    type: String,
    default: "credentials",
  },
});

const userModel = mongoose.models.User || mongoose.model("User", UserSchema);

export default userModel;

