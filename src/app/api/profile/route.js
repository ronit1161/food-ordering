import mongoose from "mongoose";
import { User } from "@/app/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // Import authOptions
import { UserInfo } from "@/app/models/userInfo";

export async function PUT(request) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);

    // Parse the request body
    const data = await request.json();
    const { name, image, ...otherUserInfo } = data;

    const session = await getServerSession(authOptions);
    const email = session.user.email;

    // Update the User's name and image
    await User.updateOne({ email }, { name, image });

    // Update the UserInfo collection, create new entry if it doesn't exist
    await UserInfo.findOneAndUpdate({ email }, otherUserInfo, { upsert: true });

    // Logging for debugging purposes
    if (name) {
      console.log("Updated data for username:", name);
    }

    // Return a successful response
    return new Response("Data updated successfully", { status: 200 });
  } catch (error) {
    console.error("Error in PUT request:", error);
    return new Response("Update failed", { status: 500 });
  }
}

export async function GET() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);

    // Get session data
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      return new Response(JSON.stringify({}), { status: 200 });
    }

    // Fetch user and userInfo from the database
    const user = await User.findOne({ email }).lean();
    const userInfo = await UserInfo.findOne({ email }).lean();

    // Return merged user and userInfo data
    return new Response(JSON.stringify({ ...user, ...userInfo }), { status: 200 });
  } catch (error) {
    console.error("Error in GET request:", error);
    return new Response("Failed to fetch data", { status: 500 });
  }
}
