import mongoose from "mongoose";
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import { User } from "@/app/models/user";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter"; // Uncomment if you want to use MongoDB adapter
import clientPromise from "../../../../libs/mongoConnect.js"

export const authOptions = {
  
  adapter: MongoDBAdapter(clientPromise), // Uncomment if using the MongoDB adapter
  secret: process.env.SECRET,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRETE,
    }),
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",

      credentials: {
        username: {
          label: "Email",
          type: "email",
          placeholder: "test@example.com",
        },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        const email = credentials?.email;
        const password = credentials?.password;

        await mongoose.connect(process.env.MONGO_URL);
        const user = await User.findOne({ email });

        if (!user) {
          throw new Error("No user found with the email.");
        }

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
        // First login - add user info to token
        token.id = user._id; // MongoDB user ID
        token.name = user.name; // User's name from MongoDB
        token.email = user.email; // User's email
      }
      return token;
    },

    // Attach token data to session
    async session({ session, token }) {
      session.user.id = token.id; // Attach MongoDB user ID
      session.user.name = token.name; // Attach user's name
      session.user.email = token.email; // Attach user's email
      return session;
    },
  },

  session: {
    strategy: "jwt", // Use JWT strategy for session handling
  },

  jwt: {
    secret: process.env.JWT_SECRET, // Ensure a JWT secret is set
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };