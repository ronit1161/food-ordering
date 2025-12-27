"use client";

import { useRouter } from "next/navigation";

export default function Custom404() {
  const router = useRouter();

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <div className="mt-12 mb-8">
        <h1 className="text-3xl">Something went wrong...</h1>
        <p className="text-xl">Username or password is incorrect</p>
      </div>
      <button onClick={() => router.push("/")} className="text-xl font-bold">
        Go to Home
      </button>
    </div>
  );
}
