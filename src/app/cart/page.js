"use client";
import { CartContext, cartProductPrice } from "@/components/AppContext";
import AddressInputs from "@/components/layout/AddressInputs";
import SectionHeaders from "@/components/layout/SectionHeaders";
import CartProduct from "@/components/menu/CartProduct";
import Script from "next/script";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

const CartPage = () => {
  const { cartProducts, removeCartProduct } = useContext(CartContext); // Use cartProducts

  const [address, setAddress] = useState({});

  let subtotal = 0;
  for (const p of cartProducts) {
    subtotal += cartProductPrice(p);
  } 

  function handleAddressChange(propName, value) {
    setAddress((prevAddress) => ({ ...prevAddress, [propName]: value }));
  }

  async function proceedToCheckout(ev) {
    ev.preventDefault(); // Prevent default form submission

    const promise = new Promise((resolve, reject) => {
      fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          cartProducts,
        }),
      })
        .then(async (response) => {
          if (response.ok) {
            const { razorpayOrderId, paymentUrl } = await response.json(); // Get Razorpay order ID from the API
            resolve();

            // Initialize Razorpay on the frontend
            const options = {
              key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Your public key from Razorpay
              amount: (subtotal + 5) * 100, // Total amount to be paid in paise (multiply by 100)
              currency: "INR",
              name: "Your Store Name", // Name of your business
              description: "Order Payment",
              order_id: razorpayOrderId, // The Razorpay order ID from backend
              handler: function (response) {
                // Handle the successful payment here
                alert(`Payment successful: ${response.razorpay_payment_id}`);
              },
              prefill: {
                name: address.name, // Customer's name
                email: address.email, // Customer's email
                contact: address.phone, // Customer's phone number
              },
              theme: {
                color: "#F37254",
              },
            };

            const rzp = new Razorpay(options);
            rzp.open(); // Open Razorpay modal
          } else {
            reject();
          }
        })
        .catch(reject);
    });

    await toast.promise(promise, {
      loading: "Preparing your order...",
      success: "Redirecting to payment...",
      error: "Something went wrong... Please try again later",
    });
  }

  return (
    <section className="mt-8">
      <Script
        type="text/javascript"
        src="https://checkout.razorpay.com/v1/checkout.js"
      ></Script>
      <div className="text-center">
        <SectionHeaders subHeader="Cart" />
      </div>

      <div className="grid grid-cols-2 gap-12 mt-8">
        <div>
          {cartProducts?.length === 0 && (
            <div>No products in your shopping cart</div>
          )}
          {cartProducts?.length > 0 &&
            cartProducts.map((product, index) => (
              <div
                className="gap-4 mb-2 border-b py-2 items-center"
                key={index}
              >
                <CartProduct
                  key={index}
                  product={product}
                  onRemove={() => removeCartProduct(index)}
                />
              </div>
            ))}
          <div className="py-2 pr-16 flex justify-end items-center">
            <div className="text-gray-500">
              Subtotal:
              <br />
              Delivery:
              <br />
              Total:
            </div>
            <div className="font-semibold pl-2 text-right">
              ${subtotal}
              <br />
              $5
              <br />${subtotal + 5}
            </div>
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2>Checkout</h2>
          <form onSubmit={proceedToCheckout}>
            <AddressInputs
              addressProps={address}
              setAddressProp={handleAddressChange}
            />
            <button type="submit">Pay ${subtotal + 5}</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
