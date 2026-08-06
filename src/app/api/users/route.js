import { User } from "@/app/models/user";
import mongoose from "mongoose";
import { isAdmin } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  await mongoose.connect(process.env.NEXT_MONGO_URL);
  if (await isAdmin()) {
    const users = await User.find();
    return Response.json(users);
  }
  return new Response("Forbidden", { status: 403 });
}