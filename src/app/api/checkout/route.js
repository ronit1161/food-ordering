import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import Razorpay from "razorpay";
import { authOptions } from "../auth/[...nextauth]/route";
import { Order } from "@/app/models/order";
import { MenuItem } from "@/app/models/MenuItem";

export async function POST(req) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.NEXT_MONGO_URL);

    // Parse the request body
    const { address, cartProducts } = await req.json();
    
    // Get the user session
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    // Save order in the database
    const orderDoc = await Order.create({
      userEmail,
      ...address,
      cartProducts,
      paid: false, // Mark the order as unpaid initially
    });

    let totalPrice = 100; // Assuming a fixed price for testing, replace with dynamic calculation

    // Initialize Razorpay with your keys
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_RAZORPAY_KEY_ID, // From environment variables
      key_secret: process.env.NEXT_RAZORPAY_KEY_SECRET, // From environment variables
    });

    // Create a Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalPrice * 100, // Convert amount to paise (multiply by 100)
      currency: "INR",
      receipt: `receipt_${orderDoc._id}`, // Unique receipt ID for this order
    });

    // Return the Razorpay order ID to the frontend
    return new Response(
      JSON.stringify({ razorpayOrderId: razorpayOrder.id }), 
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Checkout failed:", error);
    return new Response(
      JSON.stringify({ message: "Checkout failed", error }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}





// Calculate total price of cart items
    // let totalPrice = 0;
    // for (const cartProduct of cartProducts) {
    //   const productInfo = await MenuItem.findById(cartProduct._id);
    //   let productPrice = productInfo.basePrice;

    //   // Add size price if applicable
    //   if (cartProduct.size) {
    //     const size = productInfo.sizes.find(
    //       (size) => size._id.toString() === cartProduct.size._id.toString()
    //     );
    //     productPrice += size.price;
    //   }

    //   // Add extras price if applicable
    //   if (cartProduct.extras?.length > 0) {
    //     for (const cartProductExtra of cartProduct.extras) {
    //       const extraThingInfo = productInfo.extraIngredientPrices.find(
    //         (extra) => extra._id.toString() === cartProductExtra._id.toString()
    //       );
    //       productPrice += extraThingInfo.price;
    //     }
    //   }

    //   // Calculate total price for the product
    //   totalPrice += productPrice;
    // }
