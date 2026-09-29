"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginInProgress, setLoginInProgress] = useState(false);
  const router = useRouter();

  async function handleFormSubmit(ev) {
    ev.preventDefault();
    setLoginInProgress(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid email or password. Please try again.");
        setLoginInProgress(false);
      } else {
        toast.success("Logged in successfully! Welcome back.");
        router.push("/");
        router.refresh();
      }
    } catch {
      toast.error("An error occurred during login. Please try again.");
      setLoginInProgress(false);
    }
  }

  return (
    <section className="py-12">
      <div className="max-w-md mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-orange-100 shadow-card">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <span className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-amber-500 flex items-center justify-center text-white text-2xl mx-auto mb-3 shadow-md shadow-orange-500/20">
            🍕
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-display">
            Welcome Back
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Sign in to access your orders, saved addresses, and favorites.
          </p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={email}
              disabled={loginInProgress}
              onChange={(ev) => setEmail(ev.target.value)}
              required
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={password}
              disabled={loginInProgress}
              onChange={(ev) => setPassword(ev.target.value)}
              required
            />
          </div>

          <button
            disabled={loginInProgress}
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-orange-500 hover:from-primary-dark hover:to-orange-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all active:scale-[0.98] mt-2"
          >
            {loginInProgress ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-gray-400 font-medium">Or continue with</span>
          </div>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold shadow-xs transition-all"
        >
          <Image src="/google.png" alt="Google logo" width={20} height={20} />
          <span>Sign in with Google</span>
        </button>

        {/* Register Prompt */}
        <p className="text-center text-xs text-gray-500 mt-6 pt-6 border-t border-gray-100">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary font-bold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </section>
  );
}
