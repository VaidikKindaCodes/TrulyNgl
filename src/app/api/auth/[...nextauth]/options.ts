// import { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// import bcrypt from "bcryptjs";
// import DbConnect from "@/lib/dbConnect";
// import userModel from "@/model/User";

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       id: "credentials",
//       name: "Credentials",
//       credentials: {
//         identifier: { label: "Email or Username", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials: any): Promise<any> {
//         await DbConnect();

//         const user = await userModel.findOne({
//           $or: [
//             { username: credentials.identifier },
//             { email: credentials.identifier },
//           ],
//         });

//         if (!user) throw new Error("no user found with the entered data");
//         if (!user.isVerified) throw new Error("user is not verified");

//         const isPasswordCorrect = await bcrypt.compare(
//           credentials.password,
//           user.password
//         );
//         if (!isPasswordCorrect) throw new Error("incorrect password entered");

//         return user;
//       },
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user, account }) {
//       await DbConnect();

//       // On new login with Google or credentials
//       if (account && user?.email) {
//         let dbUser = await userModel.findOne({ email: user.email });

//         if (!dbUser) {
//           dbUser = await userModel.create({
//             email: user.email,
//             username: null,
//             isVerified: true,
//             isAcceptingMessages: true,
//             authProvider: account.provider,
//           });
//         }

//         token._id = dbUser._id.toString();
//         token.isVerified = dbUser.isVerified;
//         token.username = dbUser.username;
//         token.isAcceptingMessages = dbUser.isAcceptingMessages;
//         token.provider = account.provider;
//         token.email = dbUser.email;
//       }

//       // Always refresh username on every token usage
//       if (token.email) {
//         const dbUser = await userModel.findOne({ email: token.email });
//         if (dbUser) {
//           token.username = dbUser.username;
//         }
//       }

//       return token;
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user._id = token._id as string;
//         session.user.email = token.email as string;
//         session.user.isVerified = token.isVerified as boolean;
//         session.user.isAcceptingMessages = token.isAcceptingMessages as boolean;
//         session.user.username = token.username as string | null;
//         session.user.provider = token.provider as string;
//       }
//       return session;
//     },
//   },
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   pages: {
//     signIn: "sign-in",
//   },
// };
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import DbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";

type CredentialsType = {
  identifier: string;
  password: string;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: CredentialsType | undefined ,
      ) {
        if (!credentials) return null;

        await DbConnect();

        const user = await userModel.findOne({
          $or: [
            { username: credentials.identifier },
            { email: credentials.identifier },
          ],
        });

        if (!user) throw new Error("no user found with the entered data");
        if (!user.isVerified) throw new Error("user is not verified");

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) throw new Error("incorrect password entered");

        return {
          id: user._id.toString(),
          email: user.email,
          isVerified: user.isVerified,
          isAcceptingMessages: user.isAcceptingMessages,
          username: user.username,
          provider: "credentials",
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      await DbConnect();

      if (account && user?.email) {
        let dbUser = await userModel.findOne({ email: user.email });

        if (!dbUser) {
          dbUser = await userModel.create({
            email: user.email,
            username: null,
            isVerified: true,
            isAcceptingMessages: true,
            authProvider: account.provider,
          });
        }

        token._id = dbUser._id.toString();
        token.isVerified = dbUser.isVerified;
        token.username = dbUser.username;
        token.isAcceptingMessages = dbUser.isAcceptingMessages;
        token.provider = account.provider;
        token.email = dbUser.email;
      }

      if (token.email) {
        const dbUser = await userModel.findOne({ email: token.email });
        if (dbUser) {
          token.username = dbUser.username;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          _id: token._id as string,
          email: token.email as string,
          isVerified: token.isVerified as boolean,
          isAcceptingMessages: token.isAcceptingMessages as boolean,
          username: token.username as string | null,
          provider: token.provider as string,
        };
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "sign-in",
  },
};
