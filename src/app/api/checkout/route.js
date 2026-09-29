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

    if (!userEmail) {
      return new Response(
        JSON.stringify({ message: "You must be logged in to checkout" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const deliveryAddress = address?.streetAddress || address?.address || "";

    // Save order in the database
    const orderDoc = await Order.create({
      userEmail,
      phone: address?.phone || "",
      address: deliveryAddress,
      streetAddress: deliveryAddress,
      city: address?.city || "",
      postalCode: address?.postalCode || "",
      country: address?.country || "",
      cartProducts,
      paid: false, // Mark the order as unpaid initially
    });

    let subtotal = 0;

    // Calculate total price considering basePrice, sizes, extras, and quantity
    cartProducts.forEach((product) => {
      let itemPrice = product?.basePrice || 0;
      if (product?.size?.price) {
        itemPrice += product.size.price;
      }
      if (product?.extras?.length > 0) {
        for (const extra of product.extras) {
          itemPrice += extra?.price || 0;
        }
      }
      const qty = product?.quantity || 1;
      subtotal += itemPrice * qty;
    });

    const deliveryFee = subtotal > 499 || subtotal === 0 ? 0 : 49;
    const grandTotal = subtotal + deliveryFee;

    const razorpayKeyId = process.env.NEXT_RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const razorpaySecret = process.env.NEXT_RAZORPAY_KEY_SECRET;

    if (!razorpayKeyId || !razorpaySecret) {
      console.error("Razorpay credentials missing in environment variables");
      return new Response(
        JSON.stringify({ message: "Payment configuration missing on server." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Initialize Razorpay with verified keys
    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpaySecret,
      timeout: 60000,
    });

    try {
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(grandTotal * 100), // Convert amount to paise
        currency: "INR",
        receipt: `receipt_${orderDoc._id}`,
      });
      
      console.log("Razorpay Order Created successfully:", razorpayOrder.id);
    
      // Return the Razorpay order ID, DB order ID, and public Key ID to the frontend
      return new Response(JSON.stringify({ 
        razorpayOrderId: razorpayOrder.id,
        orderId: orderDoc._id,
        key: razorpayKeyId,
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      return new Response(
        JSON.stringify({
          message: error?.error?.description || error?.message || "Razorpay order creation failed",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Checkout failed:", error);
    return new Response(
      JSON.stringify({ message: error?.message || "Checkout failed" }),
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
