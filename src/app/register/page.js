"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setCreatingUser(true);
    setErrorMessage("");
    setUserCreated(false);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
        setUserCreated(true);
        toast.success("Account created successfully! You can now sign in.");
      } else {
        const errorText = data?.error || "Registration failed. Please try again.";
        setErrorMessage(errorText);
        toast.error(errorText);
      }
    } catch (err) {
      const fallbackErr = "An unexpected error occurred. Please try again later.";
      setErrorMessage(fallbackErr);
      toast.error(fallbackErr);
    }
    setCreatingUser(false);
  };

  return (
    <section className="py-12">
      <div className="max-w-md mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-orange-100 shadow-card">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <span className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-amber-500 flex items-center justify-center text-white text-2xl mx-auto mb-3 shadow-md shadow-orange-500/20">
            🍕
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-display">
            Create an Account
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Join Delight Bites to enjoy member discounts and faster reordering.
          </p>
        </div>

        {userCreated && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-emerald-800 text-xs sm:text-sm">
            🎉 Account created successfully! You can now{" "}
            <Link href="/login" className="font-bold underline text-emerald-900">
              Sign In here &raquo;
            </Link>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-center text-red-600 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={onSubmitHandler} className="space-y-4">
          <div>
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              disabled={creatingUser}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Password (min. 5 chars)</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              disabled={creatingUser}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={creatingUser}
            className="w-full bg-gradient-to-r from-primary to-orange-500 hover:from-primary-dark hover:to-orange-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all active:scale-[0.98] mt-2"
          >
            {creatingUser ? "Creating Account..." : "Create Account"}
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
          <span>Sign up with Google</span>
        </button>

        {/* Login Prompt */}
        <p className="text-center text-xs text-gray-500 mt-6 pt-6 border-t border-gray-100">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-bold hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </section>
  );
};

export default RegisterPage;
