"use client";
import { CartContext, cartProductPrice } from "@/components/AppContext";
import AddressInputs from "@/components/layout/AddressInputs";
import SectionHeaders from "@/components/layout/SectionHeaders";
import CartProduct from "@/components/menu/CartProduct";
import { UseProfile } from "@/components/UseProfile";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const CartPage = () => {
  const { cartProducts, removeCartProduct, clearCart } = useContext(CartContext); // Use cartProducts
  const router = useRouter();
  const session = useSession();
  const { status, data: sessionData } = session;
  const userEmail = sessionData?.user?.email;
  const isUnauthenticated = status === "unauthenticated" || (status !== "loading" && !userEmail);
  const { data: profileData } = UseProfile();

  const [address, setAddress] = useState({});

  useEffect(() => {
    if (isUnauthenticated) {
      router.replace("/login");
    }
  }, [isUnauthenticated, router]);

  useEffect(() => {
    if (profileData) {
      const { phone, streetAddress, city, postalCode, country } = profileData;
      setAddress({ phone, streetAddress, city, postalCode, country });
    }
  }, [profileData]);

  if (status === "loading") {
    return (
      <section className="mt-8 text-center">
        <p className="text-gray-500">Loading cart...</p>
      </section>
    );
  }

  if (isUnauthenticated) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }

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
            const { razorpayOrderId, orderId } = await response.json(); // Get Razorpay order ID and DB order ID
            resolve();

            // Initialize Razorpay on the frontend
            const options = {
              key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Your public key from Razorpay
              amount: (subtotal + 5) * 100, // Total amount to be paid in paise (multiply by 100)
              currency: "INR",
              name: "Your Store Name", // Name of your business
              description: "Order Payment",
              order_id: razorpayOrderId, // The Razorpay order ID from backend
              handler: async function (response) {
                const verifyPromise = new Promise(async (resolveVerify, rejectVerify) => {
                  try {
                    const res = await fetch("/api/verify-payment", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        orderId,
                      }),
                    });
                    if (res.ok) {
                      clearCart();
                      resolveVerify();
                      router.push("/orders/" + orderId);
                    } else {
                      rejectVerify();
                    }
                  } catch (err) {
                    rejectVerify(err);
                  }
                });

                await toast.promise(verifyPromise, {
                  loading: "Verifying your payment...",
                  success: "Payment verified successfully!",
                  error: "Payment verification failed. Please contact support.",
                });
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

            const rzp = new window.Razorpay(options);
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
