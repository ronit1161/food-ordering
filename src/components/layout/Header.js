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
      <>
        <Link className="whitespace-nowrap" href={"/profile"}>
          Hello, {userName}
        </Link>
        <button
          onClick={() => signOut()}
          className="bg-primary text-white px-4 py-2 rounded-full"
        >
          logout
        </button>
      </>
    );
  }

  if (status === "unauthenticated") {
    return (
      <>
        <Link href={"/login"}>Login</Link>
        <Link
          href={"/register"}
          className="bg-primary text-white px-4 py-2 rounded-full"
        >
          Register
        </Link>
      </>
    );
  }
}

export default function Header() {
  const session = useSession();
  const status = session?.status;

  const userData = session.data?.user;

  let userName = userData?.name || userData?.email;

  const { cartProducts } = useContext(CartContext);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 -mx-4 px-4 mb-8">
        <div className="flex items-center md:hidden justify-between max-w-6xl mx-auto">
          <Link className="text-primary font-heading font-bold text-2xl tracking-tight" href={"/"}>
            PIZZA HOUSE
          </Link>
          <div className="flex items-center gap-6">
            <Link href={"/cart"} className="relative group">
              <ShoppingCart className="w-6 h-6 text-gray-600 group-hover:text-primary transition-colors" />
              {cartProducts.length > 0 && (
                 <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold py-0.5 px-1.5 rounded-full">
                  {cartProducts.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileNavOpen((prev) => !prev)}
              className="p-1 border-none bg-transparent"
            >
              <Bars2 className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {mobileNavOpen && (
          <div
            onClick={() => setMobileNavOpen(false)}
            className="md:hidden p-4 bg-white rounded-lg mt-2 flex flex-col gap-2 text-center shadow-lg border border-gray-100"
          >
            <Link href={"/"} className="hover:text-primary transition-colors py-2">Home</Link>
            <Link href={"/menu"} className="hover:text-primary transition-colors py-2">Menu</Link>
            <Link href={"/#about"} className="hover:text-primary transition-colors py-2">About</Link>
            <Link href={"/#contact"} className="hover:text-primary transition-colors py-2">Contact</Link>
            <AuthLinks status={status} userName={userName} />
          </div>
        )}

        <div className="hidden md:flex items-center justify-between max-w-6xl mx-auto">
          <nav className="flex items-center gap-8 text-gray-500 font-medium">
            <Link className="text-primary font-heading font-bold text-3xl tracking-tight mr-4 hover:scale-105 transition-transform" href={"/"}>
              PIZZA HOUSE
            </Link>
            <Link href={"/"} className="hover:text-primary hover:bg-orange-50 px-3 py-2 rounded-lg transition-all">Home</Link>
            <Link href={"/menu"} className="hover:text-primary hover:bg-orange-50 px-3 py-2 rounded-lg transition-all">Menu</Link>
            <Link href={"/#about"} className="hover:text-primary hover:bg-orange-50 px-3 py-2 rounded-lg transition-all">About</Link>
            <Link href={"/#contact"} className="hover:text-primary hover:bg-orange-50 px-3 py-2 rounded-lg transition-all">Contact</Link>
          </nav>

          <nav className="flex items-center font-medium gap-4">
            <AuthLinks status={status} userName={userName} />
            <Link href={"/cart"} className="relative group p-2 hover:bg-orange-50 rounded-full transition-colors">
              <ShoppingCart className="w-6 h-6 text-gray-600 group-hover:text-primary transition-colors" />
              {cartProducts.length > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold py-0.5 px-1.5 rounded-full shadow-sm">
                  {cartProducts.length}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
