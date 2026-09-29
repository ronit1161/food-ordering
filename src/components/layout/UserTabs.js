"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const UserTabs = ({ isAdmin }) => {
  const path = usePathname();

  const tabs = [
    { href: "/profile", label: "Profile", icon: "👤", match: path === "/profile" },
    ...(isAdmin
      ? [
          { href: "/categories", label: "Categories", icon: "📂", match: path === "/categories" },
          { href: "/menu-items", label: "Menu Items", icon: "🍕", match: path.includes("menu-items") },
          { href: "/users", label: "Users", icon: "👥", match: path.includes("/users") },
          { href: "/orders", label: "All Orders", icon: "📋", match: path === "/orders" },
        ]
      : [
          { href: "/orders", label: "My Orders", icon: "📋", match: path === "/orders" },
        ]),
  ];

  return (
    <div className="flex mx-auto gap-2.5 justify-center flex-wrap my-8">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all border ${
            tab.match
              ? "bg-primary text-white border-primary shadow-md shadow-orange-500/25 scale-105"
              : "bg-white text-gray-700 border-gray-200 hover:border-orange-200 hover:bg-orange-50/50 shadow-xs"
          }`}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default UserTabs;