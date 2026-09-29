"use client";
import { CartContext, cartProductPrice } from "@/components/AppContext";
import AddressInputs from "@/components/layout/AddressInputs";
import SectionHeaders from "@/components/layout/SectionHeaders";
import CartProduct from "@/components/menu/CartProduct";
import { UseProfile } from "@/components/UseProfile";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const CartPage = () => {
  const {
    cartProducts,
    removeCartProduct,
    incrementCartProduct,
    decrementCartProduct,
    clearCart,
  } = useContext(CartContext);
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
      <div className="py-24 text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 font-medium">Loading your cart...</p>
      </div>
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

  const deliveryFee = subtotal > 499 || subtotal === 0 ? 0 : 49;
  const finalTotal = subtotal + deliveryFee;

  function handleAddressChange(propName, value) {
    setAddress((prevAddress) => ({ ...prevAddress, [propName]: value }));
  }

  async function proceedToCheckout(ev) {
    ev.preventDefault();

    if (typeof window === "undefined" || !window.Razorpay) {
      toast.error("Payment gateway is still loading. Please wait 2 seconds and try again.");
      return;
    }

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
            const { razorpayOrderId, orderId, key } = await response.json();
            resolve();

            const razorpayKey = key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

            const options = {
              key: razorpayKey,
              amount: Math.round(finalTotal * 100),
              currency: "INR",
              name: "Delight Bites",
              description: "Food Order Payment",
              order_id: razorpayOrderId,
              modal: {
                ondismiss: function () {
                  toast.info("Payment window closed.");
                },
              },
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
                      router.push("/orders/" + orderId + "?clear-cart=1");
                    } else {
                      const errData = await res.json().catch(() => ({}));
                      rejectVerify(new Error(errData.error || "Payment verification failed"));
                    }
                  } catch (err) {
                    rejectVerify(err);
                  }
                });

                try {
                  await toast.promise(verifyPromise, {
                    pending: "Verifying your payment...",
                    success: "Payment verified successfully!",
                    error: {
                      render({ data }) {
                        return data?.message || "Payment verification failed. Please contact support.";
                      },
                    },
                  });
                } catch {}
              },
              prefill: {
                name: address.name || sessionData?.user?.name || "",
                email: address.email || userEmail || "",
                contact: address.phone || "",
              },
              theme: {
                color: "#FF5722",
              },
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", function (response) {
              toast.error(response.error?.description || "Payment failed. Please try a different card or UPI.");
            });
            rzp.open();
          } else {
            const errData = await response.json().catch(() => ({}));
            reject(new Error(errData.message || "Failed to initialize checkout."));
          }
        })
        .catch(reject);
    });

    try {
      await toast.promise(promise, {
        pending: "Initializing payment...",
        success: "Opening Razorpay...",
        error: {
          render({ data }) {
            return data?.message || "Checkout failed. Please try again.";
          },
        },
      });
    } catch {}
  }

  return (
    <div className="py-8 max-w-6xl mx-auto">
      <Script
        type="text/javascript"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />

      <SectionHeaders subHeader="Your Order" mainHeader="Shopping Cart" />

      {cartProducts?.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-4xl border border-orange-100 shadow-card max-w-xl mx-auto my-8 p-8">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-2xl font-bold font-display text-gray-900 mb-2">
            Your cart is hungry!
          </h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
            You haven&apos;t added any delicious items yet. Browse our handcrafted menu to satisfy your cravings.
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-orange-500/25 transition-all active:scale-[0.98]"
          >
            Explore Menu 🍕
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-8">
          {/* Cart Items List */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-card">
            <div className="flex items-center justify-between pb-4 border-b border-orange-100 mb-4">
              <h3 className="font-display font-bold text-lg text-gray-900">
                Cart Items ({cartProducts.reduce((sum, p) => sum + (p.quantity || 1), 0)})
              </h3>
              <button
                onClick={clearCart}
                className="text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="divide-y divide-orange-50 space-y-1">
              {cartProducts.map((product, index) => (
                <CartProduct
                  key={index}
                  product={product}
                  onRemove={() => removeCartProduct(index)}
                  onIncrement={() => incrementCartProduct(index)}
                  onDecrement={() => decrementCartProduct(index)}
                />
              ))}
            </div>

            {/* Bill Summary */}
            <div className="mt-8 pt-6 border-t border-orange-100 space-y-2.5">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-gray-900">₹{subtotal}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Delivery Charges</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    <span className="font-semibold text-gray-900">₹{deliveryFee}</span>
                  )}
                </span>
              </div>
              {subtotal < 499 && (
                <p className="text-[11px] text-orange-600 bg-orange-50/80 px-3 py-1.5 rounded-xl border border-orange-200/50">
                  💡 Add <strong>₹{499 - subtotal}</strong> more to get <strong>FREE delivery</strong>!
                </p>
              )}
              <div className="flex items-center justify-between text-lg font-bold font-display text-gray-950 pt-3 border-t border-dashed border-gray-200">
                <span>Total Amount</span>
                <span className="text-2xl text-primary font-extrabold">₹{finalTotal}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Checkout Form */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-card flex flex-col">
            <h3 className="font-display font-bold text-lg text-gray-900 mb-4 pb-3 border-b border-orange-100">
              Delivery Details
            </h3>
            
            <form onSubmit={proceedToCheckout} className="space-y-2 flex-1 flex flex-col">
              <AddressInputs
                addressProps={address}
                setAddressProp={handleAddressChange}
              />

              <div className="pt-4 mt-auto">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-orange-500 hover:from-primary-dark hover:to-orange-600 text-white font-bold text-base py-3.5 rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all active:scale-[0.98]"
                >
                  Pay ₹{finalTotal} with Razorpay
                </button>
                <p className="text-center text-[11px] text-gray-400 mt-3 flex items-center justify-center gap-1">
                  <span>🔒</span> 256-bit encrypted checkout via Razorpay
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
