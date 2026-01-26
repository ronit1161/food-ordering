import { authOptions, isAdmin } from "@/app/api/auth/[...nextauth]/route";
import { Order } from "@/app/models/order";
import dbConnect from "@/libs/mongoose";
import { getServerSession } from "next-auth";

export async function GET(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  const admin = await isAdmin();

  console.log(admin)

  const url = new URL(req.url);
  const _id = url.searchParams.get("_id");
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  if (_id) {
    return Response.json(await Order.findById(_id).lean());
  }

  if (admin) {
    const orders = await Order.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
    return Response.json(orders);
  }

  if (userEmail) {
    const orders = await Order.find({ userEmail }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
    return Response.json(orders);
  }
}
