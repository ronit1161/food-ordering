"use client";
import { CartContext, cartProductPrice } from "@/components/AppContext";
import AddressInputs from "@/components/layout/AddressInputs";
import SectionHeaders from "@/components/layout/SectionHeaders";
import CartProduct from "@/components/menu/CartProduct";
import Script from "next/script";
import { UseProfile } from "@/components/UseProfile";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const CartPage = () => {
  const { cartProducts, removeCartProduct } = useContext(CartContext); // Use cartProducts

  const [address, setAddress] = useState({});
  const { data: profileData } = UseProfile();

  useEffect(() => {
    if (profileData) {
      const { phone, streetAddress, city, postalCode, country } = profileData;
      const addressFromProfile = {
        phone,
        streetAddress,
        city,
        postalCode,
        country,
      };
      setAddress(addressFromProfile);
    }
  }, [profileData]);

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

      <div className="grid md:grid-cols-2 gap-12 mt-12 items-start">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          {cartProducts?.length === 0 && (
            <div className="text-center text-gray-500 py-12">No products in your shopping cart</div>
          )}
          {cartProducts?.length > 0 &&
            cartProducts.map((product, index) => (
              <div
                className="gap-4 mb-4 border-b border-gray-100 pb-4 items-center last:border-0"
                key={index}
              >
                <CartProduct
                  key={index}
                  product={product}
                  onRemove={() => removeCartProduct(index)}
                />
              </div>
            ))}
          <div className="py-4 flex justify-end items-center text-lg mt-4 border-t border-gray-100 pt-8">
            <div className="text-gray-500 font-medium">
              Subtotal:
              <br />
              Delivery:
              <br />
              <span className="text-gray-900 font-bold text-xl mt-2 block">Total:</span>
            </div>
            <div className="font-bold pl-8 text-right text-gray-900">
              ${subtotal}
              <br />
              $5
              <br />
              <span className="text-primary text-xl mt-2 block">${subtotal + 5}</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 sticky top-24">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 font-heading">Checkout details</h2>
          <form onSubmit={proceedToCheckout}>
            <AddressInputs
              addressProps={address}
              setAddressProp={handleAddressChange}
            />
            <button type="submit" className="w-full mt-6 py-4 text-lg shadow-xl shadow-primary/20">Pay ${subtotal + 5}</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
