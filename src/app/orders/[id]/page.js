'use client';
import { CartContext, cartProductPrice } from "@/components/AppContext";
import AddressInputs from "@/components/layout/AddressInputs";
import SectionHeaders from "@/components/layout/SectionHeaders";
import CartProduct from "@/components/menu/CartProduct";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function OrderPage() {
  const { clearCart } = useContext(CartContext);
  const [order, setOrder] = useState();
  const [loadingOrder, setLoadingOrder] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.href.includes('clear-cart=1')) {
        clearCart();
      }
    }
    if (id) {
      setLoadingOrder(true);
      fetch('/api/orders?_id=' + id).then(res => {
        res.json().then(orderData => {
          setOrder(orderData);
          setLoadingOrder(false);
        });
      }).catch(() => setLoadingOrder(false));
    }
  }, [id, clearCart]);

  let subtotal = 0;
  if (order?.cartProducts) {
    for (const product of order?.cartProducts) {
      subtotal += cartProductPrice(product);
    }
  }

  const deliveryFee = subtotal > 499 || subtotal === 0 ? 0 : 49;
  const finalTotal = subtotal + deliveryFee;

  return (
    <section className="max-w-4xl mx-auto py-8">
      {/* Success / Status Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm">
          ✓
        </div>
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-primary mb-2">
          Order #{id?.slice(-6)?.toUpperCase()}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 font-display">
          Thank you for your order!
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Your meal is being freshly prepared in our kitchen. We will dispatch our courier shortly!
        </p>
      </div>

      {loadingOrder && (
        <div className="py-16 text-center text-gray-500">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p>Loading order details...</p>
        </div>
      )}

      {order && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Order Items */}
          <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-card">
            <div className="flex items-center justify-between pb-4 border-b border-orange-100 mb-4">
              <h3 className="font-display font-bold text-lg text-gray-900">
                Ordered Dishes
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                order.paid
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {order.paid ? '● Payment Verified' : '● Unpaid'}
              </span>
            </div>

            <div className="divide-y divide-orange-50">
              {order.cartProducts.map((product, index) => (
                <CartProduct key={index} product={product} />
              ))}
            </div>

            {/* Bill Calculation */}
            <div className="mt-8 pt-6 border-t border-orange-100 space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">₹{subtotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery Fee</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    <span className="font-semibold text-gray-900">₹{deliveryFee}</span>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between text-lg font-bold font-display text-gray-950 pt-3 border-t border-dashed border-gray-200">
                <span>Grand Total</span>
                <span className="text-2xl text-primary font-extrabold">₹{finalTotal}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="md:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-card">
            <h3 className="font-display font-bold text-lg text-gray-900 mb-4 pb-3 border-b border-orange-100">
              Delivery Destination
            </h3>
            <AddressInputs
              disabled={true}
              addressProps={order}
            />

            <div className="mt-6 pt-4 border-t border-orange-100">
              <Link
                href="/orders"
                className="w-full inline-flex items-center justify-center font-bold text-xs uppercase tracking-wider py-3 rounded-2xl bg-orange-50 text-primary border border-orange-200 hover:bg-primary hover:text-white transition-all shadow-xs"
              >
                Back to All Orders
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}