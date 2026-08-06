import mongoose from "mongoose";
import bcrypt from "bcrypt";
import NextAuth, {getServerSession} from "next-auth";
import { User } from "@/app/models/user";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter"; // Uncomment if you want to use MongoDB adapter
import clientPromise from "../../../../libs/mongoConnect.js"
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
        email: {
          label: "Email",
          type: "email",
          placeholder: "test@example.com",
        },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        const email = credentials?.email || credentials?.username;
        const password = credentials?.password;

        if (!email || !password) {
          throw new Error("Email and password are required.");
        }

        // Connect to MongoDB
        await mongoose.connect(process.env.NEXT_MONGO_URL);

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
          throw new Error("No user found with the email.");
        }

        if (!user.password) {
          throw new Error("Please log in using your Google account.");
        }

        // Compare password
        const passwordOk = bcrypt.compareSync(password, user.password);

        if (passwordOk) {
          return user; // Return full user document, which will be passed to JWT callback
        }

        return null;
      },
    }),
  ],

  // Callbacks to handle JWT and session
  callbacks: {
    // Save user information to token
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id || user.id;  // MongoDB user ID
        token.name = user.name;
        token.email = user.email;
        token.admin = user.admin;  // Ensure admin is added here
      }
      return token;
    },
    
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.admin = token.admin;  // Ensure admin is transferred here
      }
      return session;
    },

  },

  session: {
    strategy: "jwt", // Use JWT strategy for session handling
  },

  pages: {
    signIn: "/login",
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
};

export async function isAdmin() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return false;
  }
  await mongoose.connect(process.env.NEXT_MONGO_URL);
  const user = await User.findOne({ email: userEmail });
  if (user && user.admin) {
    return true;
  }
  const userInfo = await UserInfo.findOne({ email: userEmail });
  if (userInfo && userInfo.admin) {
    return true;
  }
  return false;
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
