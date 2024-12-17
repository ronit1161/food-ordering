"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useContext } from "react";
import { CartContext } from "../AppContext";
import ShoppingCart from "@/components/icons/ShoppingCart"

export default function Header() {
  const session = useSession();
  const status = session?.status;

  const userData = session.data?.user;

  let userName = userData?.name || userData?.email;

  const { cartProducts } = useContext(CartContext);

  return (
    <>
      <header className="flex items-center justify-between">
        <nav className="flex items-center gap-8 text-gray-600 font-semibold">
          <Link className="text-primary font-semibold text-2xl" href={"/"}>
            LOGO
          </Link>
          <Link href={"/"}>Home</Link>
          <Link href={"/menu"}>Menu</Link>
          <Link href={"/#about"}>About</Link>
          <Link href={"/#about"}>Contact</Link>
        </nav>

        <nav className="flex items-center font-semibold gap-4">
          {status === "authenticated" && (
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
          )}
          {status === "unauthenticated" && (
            <>
              <Link href={"/login"}>Login</Link>
              <Link
                href={"/register"}
                className="bg-primary text-white px-4 py-2 rounded-full"
              >
                Register
              </Link>
            </>
          )}
          <Link href={"/cart"} className="relative">
            <ShoppingCart />
            <span className="absolute -top-2 -right-4 bg-primary text-white text-xs py-1 px-1 rounded-full leading-3">
              ({cartProducts.length})
            </span>
          </Link>
        </nav>
      </header>
    </>
  );
}
