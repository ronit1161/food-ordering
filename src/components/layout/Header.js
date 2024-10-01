'use client'
import { useSession } from "next-auth/react";
import Link from "next/link";
export default function Header() {

  const session = useSession();

  return (
    <>
      <header className="flex items-center justify-between">

        <nav className="flex items-center gap-8 text-gray-600 font-semibold">
          <Link className="text-primary font-semibold text-2xl" href={"/"}>
            LOGO
          </Link>
          <Link href={"/"}>Home</Link>
          <Link href={""}>Menu</Link>
          <Link href={""}>About</Link>
          <Link href={""}>Contact</Link>
        </nav>

        <nav className="flex items-center font-semibold gap-4">
          <Link href={"/login"}>Login</Link>
          <Link
            href={"/register"}
            className="bg-primary text-white px-4 py-2 rounded-full"
          >
            Register
          </Link>
        </nav>
      </header>
    </>
  );
}
