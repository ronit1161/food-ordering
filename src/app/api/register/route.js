import mongoose from "mongoose";
import { User } from "../../models/user";

export async function POST(req) {
  console.log(process.env.NEXT_MONGO_URL)
    const body = await req.json();
    mongoose.connect(process.env.NEXT_MONGO_URL);
    const createdUser = await User.create(body)
    return Response.json(createdUser);

}
