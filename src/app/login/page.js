"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginInProgress, setLoginInProgress] = useState(false);

  async function handleFormSubmit(ev) {
    ev.preventDefault();
    setLoginInProgress(true); 

    await signIn("credentials", { email, password, callbackUrl: "/" });

    setLoginInProgress(false);
  }
  return (
    <section className="mt-12">
      <h1 className="text-center text-primary text-4xl mb-4 font-semibold">
        Login
      </h1>

      <form className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100" onSubmit={handleFormSubmit}>
        <input
          type="email"
          name="email"
          placeholder="email"
          value={email}
          disabled={loginInProgress}
          onChange={(ev) => setEmail(ev.target.value)}
        />

        <input
          type="password"
          name="password"
          placeholder="password"
          value={password}
          disabled={loginInProgress}
          onChange={(ev) => setPassword(ev.target.value)}
        />

        <button disabled={loginInProgress} type="submit" className="w-full py-3 text-lg shadow-lg shadow-primary/20">
          Login
        </button>

        <div className="my-6 text-center text-gray-500 relative">
          <span className="bg-white px-4 relative z-10 text-sm">or login with provider</span>
          <div className="absolute inset-x-0 top-1/2 h-px bg-gray-200 -z-0"></div>
        </div>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="flex gap-4 justify-center items-center w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:shadow-sm font-medium transition-all rounded-xl py-3"
        >
          <Image src={"/google.png"} alt={""} width={24} height={24} />
          Login with Google
        </button>
      </form>
    </section>
  );
}
