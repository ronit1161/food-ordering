'use client';
import SectionHeaders from "@/components/layout/SectionHeaders";
import UserTabs from "@/components/layout/UserTabs";
import { UseProfile } from "@/components/UseProfile";
import { dbTimeForHuman } from "@/libs/datetime";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const { loading, data: profile } = UseProfile();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  function fetchOrders() {
    setLoadingOrders(true);
    fetch('/api/orders').then(res => {
      res.json().then(orders => {
        if (Array.isArray(orders)) {
          setOrders(orders.reverse());
        }
        setLoadingOrders(false);
      });
    }).catch(() => setLoadingOrders(false));
  }

  return (
    <section className="py-6 max-w-4xl mx-auto">
      <UserTabs isAdmin={profile?.admin} />

      <div className="mt-8">
        <SectionHeaders subHeader="Order History" mainHeader={profile?.admin ? "All Orders" : "My Orders"} />

        {loadingOrders ? (
          <div className="space-y-4 mt-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-6 border border-orange-100 shadow-card animate-pulse h-24" />
            ))}
          </div>
        ) : orders?.length > 0 ? (
          <div className="space-y-4 mt-8">
            {orders.map(order => (
              <div
                key={order._id}
                className="bg-white p-5 sm:p-6 rounded-3xl border border-orange-100 shadow-card hover:shadow-card-hover transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 grow">
                  {/* Paid / Unpaid Status Badge */}
                  <div>
                    <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border ${
                      order.paid
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${order.paid ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      {order.paid ? 'Paid' : 'Pending'}
                    </span>
                  </div>

                  {/* Customer info & Date */}
                  <div className="grow min-w-0">
                    <div className="flex items-center gap-2 flex-wrap text-sm font-semibold text-gray-900">
                      <span className="truncate">{order.userEmail}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs font-normal text-gray-500">{dbTimeForHuman(order.createdAt)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                      {order.cartProducts?.map(p => p.name).join(', ')}
                    </p>
                  </div>
                </div>

                {/* View Details Link */}
                <div className="flex-shrink-0">
                  <Link
                    href={"/orders/" + order._id}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-xs font-bold bg-orange-50 text-primary border border-orange-200 hover:bg-primary hover:text-white transition-all shadow-xs"
                  >
                    View Order Details ➔
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200 mt-8 p-8">
            <div className="text-5xl mb-3">📦</div>
            <p className="text-lg font-bold text-gray-900">No orders placed yet</p>
            <p className="text-xs text-gray-400 mt-1">When you place orders, they will appear here with full live status.</p>
            <Link
              href="/menu"
              className="inline-flex mt-6 px-6 py-2.5 rounded-full text-xs font-bold bg-primary text-white shadow-md shadow-orange-500/25"
            >
              Order Something Delicious
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}