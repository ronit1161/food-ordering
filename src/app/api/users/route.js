import { User } from "@/app/models/user";
import dbConnect from "@/libs/mongoose";

export async function GET() {
    await dbConnect();
    const users = await User.find().lean();
    return Response.json(users);
}