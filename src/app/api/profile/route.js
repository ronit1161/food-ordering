import dbConnect from "@/libs/mongoose";
import { User } from "@/app/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // Import authOptions
import { UserInfo } from "@/app/models/userInfo";


export async function PUT(request) {
  try {
    await dbConnect();

    const data = await request.json();
    const { _id, name, image, admin, ...otherUserInfo } = data;

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

    // Update the User's name, image, and admin status
    await User.updateOne(filter, { name, image, admin });

    // Update the UserInfo collection, map 'admin' to 'isAdmin'
    await UserInfo.findOneAndUpdate(filter, { ...otherUserInfo, image, isAdmin: admin }, {
      upsert: true,
    });

    return new Response(JSON.stringify(true), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error in PUT request:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// GET request - Fetch User and UserInfo
export async function GET(request) {
  try {
    // Connect to MongoDB
    // Connect to MongoDB
    await dbConnect();

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

    // If the user is not found, return a 404 response
    if (!user) {
      return new Response(JSON.stringify({}), { status: 404 });
    }

    // Return merged user and userInfo data
    // Map 'isAdmin' from UserInfo back to 'admin' for frontend consistency if needed
    return new Response(JSON.stringify({ ...user, ...userInfo, admin: user.admin || userInfo?.isAdmin }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in GET request:", error);
    return new Response("Failed to fetch data", { status: 500 });
  }
}
