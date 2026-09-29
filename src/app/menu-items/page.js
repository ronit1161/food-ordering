"use client";
import UserTabs from "@/components/layout/UserTabs";
import SectionHeaders from "@/components/layout/SectionHeaders";
import { UseProfile } from "@/components/UseProfile";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Right from "@/components/icons/Right";

const MenuItemsPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const { loading: profileLoading, data: profileData } = UseProfile();

  useEffect(() => {
    fetch("/api/menu-items").then((res) => {
      res.json().then((items) => {
        if (Array.isArray(items)) {
          setMenuItems(items);
        }
        setLoadingItems(false);
      });
    }).catch(() => setLoadingItems(false));
  }, []);

  if (profileLoading) {
    return (
      <div className="py-24 text-center text-gray-500">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p>Loading menu items...</p>
      </div>
    );
  }

  if (!profileData?.admin) {
    return (
      <div className="py-24 text-center text-gray-500">
        <p className="text-xl font-bold text-gray-900">Access Denied</p>
        <p className="text-sm mt-1">You must have administrator privileges to view this page.</p>
      </div>
    );
  }

  return (
    <section className="py-6 max-w-5xl mx-auto">
      <UserTabs isAdmin={true} />

      <div className="mt-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-950 font-display">
              Menu Items Manager
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Create, edit, or customize dishes, portion sizes, and pricing.
            </p>
          </div>

          <Link
            href="/menu-items/new"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-orange-500 hover:from-primary-dark hover:to-orange-600 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/35 transition-all"
          >
            <span>+ Create New Dish</span>
            <Right />
          </Link>
        </div>

        {loadingItems ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-5 border border-orange-100 shadow-card animate-pulse h-64" />
            ))}
          </div>
        ) : menuItems?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Link
                key={item._id}
                href={"/menu-items/edit/" + item._id}
                className="bg-white rounded-3xl p-5 border border-orange-100/80 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all group flex flex-col"
              >
                <div className="w-full h-40 relative rounded-2xl overflow-hidden bg-gradient-to-b from-orange-50 to-orange-100/30 mb-3 flex items-center justify-center">
                  {item.image ? (
                    <Image
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      src={item.image}
                      alt={item.name}
                    />
                  ) : (
                    <div className="text-4xl">🍕</div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-base text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-orange-50 flex items-center justify-between mt-3">
                    <span className="text-base font-extrabold text-gray-950 font-display">
                      ₹{item.basePrice}
                    </span>
                    <span className="text-xs font-semibold text-primary group-hover:underline">
                      Edit Dish ➔
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-500 text-sm">No dishes created yet.</p>
            <Link
              href="/menu-items/new"
              className="inline-block mt-4 text-xs font-bold text-primary hover:underline"
            >
              Add your first dish &raquo;
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuItemsPage;
