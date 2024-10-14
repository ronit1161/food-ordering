// import mongoose from "mongoose";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../auth/[...nextauth]/route";

// export async function PUT() {
//     await mongoose.connect(process.env.MONGO_URL);
//     const data = await request.json();
//     const session = await getServerSession(authOptions);
//     console.log(session);
//     if ('name' in data) {

//     }
// }




import mongoose from "mongoose";
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
        console.log("Session:", session);

        // Example condition if 'name' exists in the data
        if ('name' in data) {
            console.log("Name found:", data.name);
            // Add your logic here to handle the 'name'
        }

        // Return a successful response
        return new Response("Data updated successfully", { status: 200 });
    } catch (error) {
        console.error("Error in PUT request:", error);
        return new Response("Update failed", { status: 500 });
    }
}
