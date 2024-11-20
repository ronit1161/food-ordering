// import mongoose from "mongoose";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../auth/[...nextauth]/route";
// import { User } from "@/app/models/user";

// export async function PUT(req) {

//     await mongoose.connect(process.env.MONGO_URL);
//     const data = await request.json();
//     const session = await getServerSession(authOptions);
//     const email = session.user.email;

//     console.log(email)

//     console.log(session);

//     if ('name' in data) {
//         // update user name
//         await User.updateOne({email}, {name:data.name});

//     }

//     return Response.json(true)
// }





import mongoose from "mongoose";
import { User } from "@/app/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // Import authOptions

export async function PUT(request) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);

    // Parse the request body
    const data = await request.json();

    
    // Get the session
    const session = await getServerSession(authOptions);
    
    const email = session.user.email;

    const update = {};
    if ('name' in data) {
      update.name = data.name;
    }

    if ('image' in data) {
      update.image = data.image;
    }

    // Example condition if 'name' exists in the data
    if ("name" in data) {
      console.log("Name found:", data.name);
      // Add your logic here to handle the 'name'
      await User.updateOne({ email }, { name: data.name });
      console.log(data.name);
    }
    // Return a successful response
    return new Response("Data updated successfully", { status: 200 });
    
  } catch (error) {
    console.error("Error in PUT request:", error);
    return new Response("Update failed", { status: 500 });
  }
}
