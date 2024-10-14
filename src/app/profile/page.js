"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Import the useRouter hook for client-side redirection
import Image from "next/image";
import React, { useState, useEffect } from "react";

const ProfilePage = () => {
  const { data: session, status } = useSession(); // Destructure session and status from useSession
  const [userName, setUserName] = useState(session?.user?.name || "");
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // Redirect to login page if unauthenticated
    }
  }, [status, router]); // Trigger effect when status changes

  const handleProfileInfoUpdate = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: userName }),
    });
  };

  if (status === "loading") {
    return "Loading Profile ....";
  }

  const userImage = session?.user?.image;

  return (
    <section className="mt-8">
      <h1 className="text-center text-primary text-4xl mb-4 font-semibold">
        Profile
      </h1>

      <div className="max-w-md mx-auto ">
        <div className="flex gap-4 items-center">
          <div>
            <div className="bg-gray-100 p-2 rounded-lg">
              <Image
                className="rounded-lg w-full h-full mb4"
                src={userImage}
                width={250}
                height={250}
                alt="Avatar"
              />
              <button>Change Avatar</button>
            </div>
          </div>

          <form className="grow" onSubmit={handleProfileInfoUpdate}>
            <input
              type="text"
              placeholder="first and last name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              type="email"
              disabled={true}
              value={session?.user?.email}
            />
            <button type="submit">Save</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
