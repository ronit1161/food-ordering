"use client";
import { useEffect, useState } from "react";
import MenuItem from "../menu/MenuItem";
import SectionHeaders from "./SectionHeaders";
import Link from "next/link";
import Right from "../icons/Right";

export const HomeMenu = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/menu-items").then((res) => res.json()),
      fetch("/api/categories").then((res) => res.json()),
    ])
      .then(([menuItems, cats]) => {
        if (Array.isArray(menuItems)) {
          setBestSellers(menuItems);
        }
        if (Array.isArray(cats)) {
          setCategories(cats);
        }
      })
      .catch((err) => console.error("Error loading home menu data:", err))
      .finally(() => setLoading(false));
  }, []);

  const displayedItems =
    activeCategory === "all"
      ? bestSellers.slice(0, 6)
      : bestSellers.filter((item) => item.category === activeCategory);

  return (
    <section className="relative py-12">
      <SectionHeaders
        subHeader="Customer Favorites"
        mainHeader="Our Best Sellers"
      />

      {/* Category Pills Filter */}
      {categories.length > 0 && (
        <div className="flex items-center justify-center flex-wrap gap-2.5 my-8">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
              activeCategory === "all"
                ? "bg-primary text-white border-primary shadow-md shadow-orange-500/25 scale-105"
                : "bg-white text-gray-700 border-gray-200 hover:border-orange-200 hover:bg-orange-50/50"
            }`}
          >
            🔥 All Specials
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              onClick={() => setActiveCategory(c._id)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                activeCategory === c._id
                  ? "bg-primary text-white border-primary shadow-md shadow-orange-500/25 scale-105"
                  : "bg-white text-gray-700 border-gray-200 hover:border-orange-200 hover:bg-orange-50/50"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Dishes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-3xl p-6 border border-orange-100 shadow-card animate-pulse flex flex-col items-center"
            >
              <div className="w-36 h-36 bg-gray-200 rounded-full mb-4"></div>
              <div className="w-3/4 h-5 bg-gray-200 rounded-md mb-2"></div>
              <div className="w-full h-12 bg-gray-100 rounded-md mb-4"></div>
              <div className="w-1/2 h-10 bg-gray-200 rounded-full mt-auto"></div>
            </div>
          ))}
        </div>
      ) : displayedItems?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8">
          {displayedItems.map((item) => (
            <MenuItem {...item} key={item._id} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 bg-white rounded-3xl border border-dashed border-gray-200 p-8">
          <p className="text-lg font-medium">No dishes found in this category.</p>
          <p className="text-sm text-gray-400 mt-1">Check back soon for freshly added items!</p>
        </div>
      )}

      {/* View Full Menu CTA */}
      <div className="text-center mt-12">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white shadow-sm hover:shadow-lg hover:shadow-orange-500/25 transition-all group active:scale-[0.98]"
        >
          <span>View Complete Menu</span>
          <span className="group-hover:translate-x-1 transition-transform">
            <Right />
          </span>
        </Link>
      </div>
    </section>
  );
};
