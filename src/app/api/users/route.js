import { User } from "@/app/models/user";
import mongoose from "mongoose";

export async function GET() {
    mongoose.connect(process.env.NEXT_MONGO_URL);
    const users = await User.find();
    return Response.json(users);
}