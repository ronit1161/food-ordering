import mongoose from "mongoose";
import { User } from "@/app/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // Import authOptions
import { UserInfo } from "@/app/models/userInfo";


export async function PUT(request) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.NEXT_MONGO_URL);

    // Parse the request body
    const data = await request.json();
    const { _id, name, image, ...otherUserInfo } = data;

    let filter = {};

    if (_id) {
      filter = { _id };
    } else {
      const session = await getServerSession(authOptions);
      const email = session?.user?.email;

      if (!email) {
        return new Response("Unauthorized", { status: 401 });
      }

      filter = { email };
    }

    // Update the User's name and image
    await User.updateOne(filter, { name, image });

    // Update the UserInfo collection, create new entry if it doesn't exist
    await UserInfo.findOneAndUpdate(filter, otherUserInfo, {
      upsert: true,
    });

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

// GET request - Fetch User and UserInfo
export async function GET(request) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.NEXT_MONGO_URL);

    // Create a new URL object from the request URL
    const url = new URL(request.url);
    const _id = url.searchParams.get("_id");

    let user = null;
    let userInfo = null;

    if (_id) {
      // Fetch user and userInfo from the database using _id
      user = await User.findOne({ _id }).lean();
      if (user) {
        userInfo = await UserInfo.findOne({ email: user.email }).lean();
      }
    } else {
      // Get session data
      const session = await getServerSession(authOptions);
      const email = session?.user?.email;

      if (!email) {
        return new Response(JSON.stringify({}), { status: 200 });
      }

      // Fetch user and userInfo from the database using email
      user = await User.findOne({ email }).lean();
      userInfo = await UserInfo.findOne({ email }).lean();
    }

    // If the user or userInfo is not found, return an empty response
    if (!user || !userInfo) {
      return new Response(JSON.stringify({}), { status: 404 });
    }

    // Return merged user and userInfo data
    return new Response(JSON.stringify({ ...user, ...userInfo }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in GET request:", error);
    return new Response("Failed to fetch data", { status: 500 });
  }
}
