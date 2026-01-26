import dbConnect from "@/libs/mongoose";
import { User } from "../../models/user";

export async function POST(req) {
  const body = await req.json();
  const { password } = body;

  if (!password || password.length < 5) {
    return new Response(JSON.stringify({ error: "Password must be at least 5 characters" }), { status: 400 });
  }

  // Ensure database connection
  await dbConnect();

  try {
    // Create a new user in the database
    // This will trigger the pre-save hook in the User model to hash the password
    const createdUser = await User.create(body);
    return new Response(JSON.stringify(createdUser), { status: 201 });
  } catch (error) {
    // Handle any errors during user creation (e.g., unique email violation)
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}
