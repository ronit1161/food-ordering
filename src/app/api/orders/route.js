import { authOptions, isAdmin } from "@/app/api/auth/[...nextauth]/route";
import { Order } from "@/app/models/order";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

export async function GET(req) {
  await mongoose.connect(process.env.NEXT_MONGO_URL);

  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return new Response("Unauthorized", { status: 401 });
  }

  const admin = await isAdmin();

  const url = new URL(req.url);
  const _id = url.searchParams.get("_id");
  if (_id) {
    const order = await Order.findById(_id);
    if (!order) {
      return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
    }
    if (admin || order.userEmail === userEmail) {
      return Response.json(order);
    }
    return new Response("Forbidden", { status: 403 });
  }

  if (admin) {
    return Response.json(await Order.find());
  }

  return Response.json(await Order.find({ userEmail }));
}
