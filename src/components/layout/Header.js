"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useContext, useState } from "react";
import { CartContext } from "../AppContext";
import ShoppingCart from "@/components/icons/ShoppingCart";
import Bars2 from "../icons/Bars2";

function AuthLinks({ status, userName }) {
  if (status === "authenticated") {
    return (
      <div className="flex items-center gap-3">
        <Link
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-gray-700 bg-orange-50/80 border border-orange-100 hover:bg-orange-100/80 hover:text-primary transition-all"
          href="/profile"
        >
          <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-amber-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
            {userName?.charAt(0)?.toUpperCase() || "U"}
          </span>
          <span className="max-w-[120px] truncate">{userName}</span>
        </Link>
        <button
          onClick={() => signOut()}
          className="text-xs font-semibold text-gray-500 hover:text-red-600 px-3 py-2 rounded-full hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
        >
          Sign Out
        </button>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="text-sm font-semibold text-gray-700 hover:text-primary px-3 py-2 transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="inline-flex items-center text-sm font-semibold text-white bg-primary hover:bg-primary-dark px-5 py-2.5 rounded-full shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/35 transition-all active:scale-[0.98]"
        >
          Register
        </Link>
      </div>
    );
  }

  return (
    <div className="w-20 h-8 rounded-full bg-gray-100 animate-pulse"></div>
  );
}

export default function Header() {
  const session = useSession();
  const userData = session.data?.user;
  const isAuthenticated = session?.status === "authenticated" && !!userData?.email;
  const status = isAuthenticated ? "authenticated" : session?.status === "loading" ? "loading" : "unauthenticated";

  let userName = userData?.name || userData?.email;

  const { cartProducts } = useContext(CartContext);
  const totalCartCount = cartProducts.reduce((sum, p) => sum + (p.quantity || 1), 0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const cartHref = isAuthenticated ? "/cart" : "/login";

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-orange-100/70 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile View */}
        <div className="flex items-center md:hidden justify-between py-3.5">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold font-display text-gray-900">
            <span className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-primary to-amber-500 flex items-center justify-center text-white text-lg shadow-sm shadow-orange-500/20">
              🍕
            </span>
            <span>Delight<span className="text-primary">Bites</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href={cartHref}
              className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-50 text-primary border border-orange-200"
            >
              <ShoppingCart />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileNavOpen((prev) => !prev)}
              className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 border border-gray-200"
              aria-label="Toggle navigation"
            >
              <Bars2 />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileNavOpen && (
          <div
            onClick={() => setMobileNavOpen(false)}
            className="md:hidden py-4 border-t border-orange-100 bg-white rounded-2xl shadow-xl mt-1 mb-3 px-4 flex flex-col gap-3 text-center"
          >
            <Link href="/" className="py-2 text-gray-700 font-semibold hover:text-primary">
              Home
            </Link>
            <Link href="/menu" className="py-2 text-gray-700 font-semibold hover:text-primary">
              Full Menu
            </Link>
            <Link href="/#about" className="py-2 text-gray-700 font-semibold hover:text-primary">
              Our Story
            </Link>
            <Link href="/#contact" className="py-2 text-gray-700 font-semibold hover:text-primary">
              Contact
            </Link>
            <div className="pt-2 border-t border-gray-100 flex justify-center">
              <AuthLinks status={status} userName={userName} />
            </div>
          </div>
        )}

        {/* Desktop View */}
        <div className="hidden md:flex items-center justify-between py-4">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2.5 text-2xl font-bold font-display text-gray-900 group">
              <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-amber-500 flex items-center justify-center text-white text-xl shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                🍕
              </span>
              <span>Delight<span className="text-primary">Bites</span></span>
            </Link>

            <nav className="flex items-center gap-7 text-sm font-semibold text-gray-600">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/menu" className="hover:text-primary transition-colors">
                Menu
              </Link>
              <Link href="/#about" className="hover:text-primary transition-colors">
                Our Story
              </Link>
              <Link href="/#contact" className="hover:text-primary transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <AuthLinks status={status} userName={userName} />
            
            <Link
              href={cartHref}
              className="relative inline-flex items-center gap-2 bg-gradient-to-r from-primary to-orange-500 hover:from-primary-dark hover:to-orange-600 text-white font-semibold text-sm px-4 py-2.5 rounded-full shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 transition-all active:scale-[0.98]"
            >
              <ShoppingCart />
              <span>Cart</span>
              {totalCartCount > 0 && (
                <span className="bg-white text-primary text-xs font-bold px-2 py-0.5 rounded-full shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
