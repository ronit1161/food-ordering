import mongoose from "mongoose";
import bcrypt from "bcrypt";
import NextAuth, { getServerSession } from "next-auth";
import { User } from "@/app/models/user";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "../../../../libs/mongoConnect.js";
import { UserInfo } from "@/app/models/userInfo.js";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",

      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        const email = credentials.email;
        const password = credentials.password;

        if (mongoose.connection.readyState === 0) {
          await mongoose.connect(process.env.NEXT_MONGO_URL);
        }

        const user = await User.findOne({ email }).lean();
        
        if (!user) {
          throw new Error("No user found with the email.");
        }

        const passwordOk = await bcrypt.compare(password, user.password);
        
        if (passwordOk) {
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        }

        throw new Error("Invalid credentials.");
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id;
        token.name = user.name;
        token.email = user.email;
        token.admin = user.admin;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.admin = token.admin;
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },

  // Custom page redirects
  pages: {
    signIn: '/auth/signin',  // Redirect to this page for sign-in
    signOut: '/menu', // Redirect here for sign-out
    error: '/error',    // Error page on sign-in failures
  },

};

export async function isAdmin() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return false;
  }
  const userInfo = await UserInfo.findOne({ email: userEmail });
  if (!userInfo) {
    return false;
  }
  return userInfo.isAdmin;
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
