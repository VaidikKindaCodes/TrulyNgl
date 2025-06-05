import { NextAuthOptions } from "next-auth";
import  CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import DbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";

export const authOptions:NextAuthOptions ={
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials:{
                identifier: { label: 'Email or Username', type: 'text' }, 
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials: any):Promise<any>{
                await DbConnect();
                try {
                    const user= await userModel.findOne({
                        $or: [{username : credentials.identifier}, {email: credentials.identifier}]
                    })
                    if(!user){
                        throw new Error("no user found with the entered data");
                    }
                    if(!user.isVerified){
                        throw new Error("user is not verified , please verify first");
                    }
                    const isPasswordCorrect= await bcrypt.compare(credentials.password , user.password);
                    if(!isPasswordCorrect){
                        throw new Error("incorrect password entered");
                    }
                    else return user;
                } catch (error : any) {
                    throw new Error(error.message ?? error);
                }
            }
        })
    ],
    callbacks: {
        async jwt({token ,user}){
            if(user){
                token._id  = user._id?.toString();
                token.isVerified  = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id as string;
                session.user.isVerified = token.isVerified as boolean;
                session.user.isAcceptingMessages = token.isAcceptingMessages as boolean;
                session.user.username = token.username as string;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages:{
        signIn: "sign-in"
    }
};
