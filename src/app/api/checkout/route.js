import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import Razorpay from "razorpay";
import { authOptions } from "../auth/[...nextauth]/route";
import { Order } from "@/app/models/order";

export async function POST(req) {
  try {
    // Ensure MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.NEXT_MONGO_URL);
    }

    // Parse the request body
    const { address, cartProducts } = await req.json();

    // Check if cartProducts is empty
    if (!cartProducts || cartProducts.length === 0) {
      return new Response(JSON.stringify({ message: "Cart is empty" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

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

    let totalPrice = 0;

    // Calculate the total price
    cartProducts.forEach((product) => {
      if (product?.basePrice) {
        totalPrice += product.basePrice; // Add base price of each product
        totalPrice += 5;
      }
    });

    console.log("Total Price:", totalPrice);

    // Initialize Razorpay with your keys
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_RAZORPAY_KEY_ID, 
      key_secret: process.env.NEXT_RAZORPAY_KEY_SECRET,
      timeout: 60000 // Timeout in milliseconds (60 seconds)
    });

    console.log("Razorpay Instance:", razorpay);


    try {
      const razorpayOrder = await razorpay.orders.create({
        amount: totalPrice * 100, // Convert amount to paise (multiply by 100)
        currency: "INR",
        receipt: `receipt_${orderDoc._id}`, // Unique receipt ID for this order
      });
      
      console.log("Razorpay Order Created:", razorpayOrder);
    
      // Return the Razorpay order ID to the frontend
      return new Response(JSON.stringify({ razorpayOrderId: razorpayOrder.id }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      return new Response(JSON.stringify({ message: "Razorpay order creation failed", error }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Checkout failed:", error);
    return new Response(JSON.stringify({ message: "Checkout failed", error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
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
