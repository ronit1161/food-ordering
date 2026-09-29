"use client";
import SectionHeaders from "@/components/layout/SectionHeaders";
import MenuItem from "@/components/menu/MenuItem";
import React, { useEffect, useState } from "react";

const MenuPage = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((res) => res.json()),
      fetch("/api/menu-items").then((res) => res.json()),
    ])
      .then(([cats, items]) => {
        if (Array.isArray(cats)) setCategories(cats);
        if (Array.isArray(items)) setMenuItems(items);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-8 space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-primary mb-3">
          Our Full Selection
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-950 font-display">
          Handcrafted Menu
        </h1>
        <p className="mt-3 text-gray-500 text-sm sm:text-base">
          Every pizza is hand-stretched, every burger flame-grilled to order. Fresh, delicious comfort food crafted for real food lovers.
        </p>
      </div>

      {/* Category Quick Jump Pills */}
      {categories?.length > 0 && (
        <div className="flex items-center justify-center flex-wrap gap-2.5 pb-4 border-b border-orange-100">
          {categories.map((c) => (
            <a
              key={c._id}
              href={`#category-${c._id}`}
              className="px-5 py-2 rounded-full text-xs font-bold bg-white text-gray-700 border border-gray-200 hover:border-primary hover:text-primary hover:bg-orange-50/50 shadow-xs transition-all"
            >
              {c.name}
            </a>
          ))}
        </div>
      )}

      {/* Menu Categories */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-white rounded-3xl p-6 border border-orange-100 shadow-card animate-pulse flex flex-col items-center"
            >
              <div className="w-36 h-36 bg-gray-200 rounded-full mb-4"></div>
              <div className="w-3/4 h-5 bg-gray-200 rounded-md mb-2"></div>
              <div className="w-full h-12 bg-gray-100 rounded-md mb-4"></div>
            </div>
          ))}
        </div>
      ) : categories?.length > 0 ? (
        categories.map((c) => {
          const categoryItems = menuItems.filter((item) => item.category === c._id);
          if (categoryItems.length === 0) return null;

          return (
            <section key={c._id} id={`category-${c._id}`} className="scroll-mt-24">
              <div className="mb-6 flex items-center justify-between border-b border-orange-100 pb-3">
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-gray-900 flex items-center gap-2">
                  <span className="text-primary">🍽️</span> {c.name}
                </h2>
                <span className="text-xs font-semibold text-gray-400 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                  {categoryItems.length} items
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {categoryItems.map((item) => (
                  <MenuItem {...item} key={item._id} />
                ))}
              </div>
            </section>
          );
        })
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
          <p className="text-lg font-medium text-gray-600">No items available yet.</p>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
