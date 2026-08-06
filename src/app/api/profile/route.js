import mongoose from "mongoose";
import { User } from "@/app/models/user";
import { getServerSession } from "next-auth";
import { authOptions, isAdmin } from "../auth/[...nextauth]/route"; // Import authOptions and isAdmin
import { UserInfo } from "@/app/models/userInfo";


export async function PUT(request) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.NEXT_MONGO_URL);
    // Parse the request body
    const data = await request.json();
    console.log("PUT HIT");
    console.log(data);
    const { _id, name, image, email, ...otherUserInfo } = data;
    delete otherUserInfo.email;
    delete otherUserInfo._id;

    // Check authentication
    const session = await getServerSession(authOptions);
    const sessionEmail = session?.user?.email;
    if (!sessionEmail) {
      return new Response("Unauthorized", { status: 401 });
    }

    const userIsAdmin = await isAdmin();

    let userEmail = "";
    if (_id) {
      // Only admins can update other users by ID
      if (!userIsAdmin) {
        return new Response("Forbidden", { status: 403 });
      }
      const targetUser = await User.findOne({ _id });
      if (!targetUser) {
        return new Response("User not found", { status: 404 });
      }
      userEmail = targetUser.email;
    } else {
      userEmail = sessionEmail;
    }

    if (!userEmail) {
      return new Response("User email required", { status: 400 });
    }

    // Protect admin status change from non-admins
    if (!userIsAdmin) {
      delete otherUserInfo.admin;
    }

    const emailFilter = { email: { $regex: new RegExp("^" + userEmail.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "$", "i") } };

    // Update User model fields
    const userUpdate = { name, image };
    if (userIsAdmin && 'admin' in otherUserInfo) {
      userUpdate.admin = otherUserInfo.admin;
    }
    await User.updateOne(emailFilter, userUpdate);

    // Update UserInfo collection, create new entry if it doesn't exist
    const addressValue = otherUserInfo.streetAddress || otherUserInfo.address || "";
    await UserInfo.findOneAndUpdate(
      emailFilter,
      { ...otherUserInfo, streetAddress: addressValue, address: addressValue, email: userEmail },
      { upsert: true, new: true }
    );

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

    const session = await getServerSession(authOptions);
    const sessionEmail = session?.user?.email;

    if (!sessionEmail) {
      return new Response(JSON.stringify({}), { status: 200 });
    }

    let user = null;
    let userInfo = null;

    if (_id) {
      // Only admins can view other users' profiles
      const userIsAdmin = await isAdmin();
      if (!userIsAdmin) {
        return new Response("Forbidden", { status: 403 });
      }
      user = await User.findOne({ _id }).lean();
      if (user) {
        userInfo = await UserInfo.findOne({ email: user.email }).lean();
      }
    } else {
      // Fetch user and userInfo from the database using session email
      user = await User.findOne({ email: sessionEmail }).lean();
      userInfo = await UserInfo.findOne({ email: sessionEmail }).lean();
    }

    // If the user is not found, return an empty response
    if (!user) {
      return new Response(JSON.stringify({}), { status: 404 });
    }

    const admin = !!(user?.admin || userInfo?.admin);
    const streetAddress = userInfo?.streetAddress || userInfo?.address || "";

    // Return merged user and userInfo data with explicit admin calculation
    return new Response(JSON.stringify({ ...user, ...userInfo, streetAddress, admin }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in GET request:", error);
    return new Response("Failed to fetch data", { status: 500 });
  }
}
