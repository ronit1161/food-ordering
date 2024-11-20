"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";


export default function Header() {

  const session = useSession();
  const status = session?.status;

  const userData = session.data?.user;

  let userName = userData?.name || userData?.email;  

  
  ///// For email where name is not present.

  // if (userName && userName.includes(" ")) {
  //   userName = userName.split(" ")[0];
  // }

  // if (userName && userName.includes("@")) {
  //   // Split at the "@" and take the first part (username)
  //   userName = userName.split("@")[0];  // Get "john.doe"
  
  //   // Replace all dots (.) with spaces
  //   userName = userName.replace(/\./g, " ");  // Convert "john.doe" -> "john doe"
  // }

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
        </nav>
      </header>
    </>
  );
}
