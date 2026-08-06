import crypto from "crypto";
import mongoose from "mongoose";
import { Order } from "@/app/models/order";

export async function POST(req) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId } = await req.json();

    const secret = process.env.NEXT_RAZORPAY_KEY_SECRET;
    if (!secret) {
      return new Response(
        JSON.stringify({ error: "NEXT_RAZORPAY_KEY_SECRET is not defined in environment variables" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return new Response(
        JSON.stringify({ error: "Invalid signature, verification failed" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.NEXT_MONGO_URL);
    }

    // Update order to paid: true
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { paid: true },
      { new: true }
    );

    if (!updatedOrder) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Payment verified successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in verify-payment API:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
