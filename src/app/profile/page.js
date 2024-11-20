"use client";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Import the useRouter hook for client-side redirection
import Image from "next/image";
import React, { useState, useEffect } from "react";

const ProfilePage = () => {
  const session = useSession(); // Destructure session and status from useSession
  
  const [userName, setUserName] = useState(" ");
  const [image, setImage] = useState("");
  // const [saved, setSaved] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");

  const { status } = session;

  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    if (status === "authenticated") {
      setUserName(session.data.user.name);
      setImage(session.data.user.image);
    }
  }, [session, status]);

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
      body: JSON.stringify({ name: userName, image }),
    });

    if (response.ok) {
      // Refetch the session after successful update
      const updatedSession = await getSession(); // Refetch session data
      console.log("Session updated:", updatedSession);
    }
  };

  if (status === "loading") {
    return "Loading Profile ....";
  }

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (files?.length > 0) {
      const data = new FormData();
      // Append the first file (assuming single file upload)
      data.append("file", files[0]);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const link = await response.json();
      setImage(link); // Update the image URL with the uploaded file link
    }
  };

  return (
    <section className="mt-8">
      <h1 className="text-center text-primary text-4xl mb-4 font-semibold">
        Profile
      </h1>

      <div className="max-w-md mx-auto ">
        {/* <h2 className="text-center bg-green-200 p-4 mb-2 rounded-lg border-green-500">
          The Profile is Updated successfully
        </h2> */}
        <div className="flex gap-4">
          <div>
            <div className="bg-gray-100 p-2 rounded-lg max-w-[120px] min-w-[100px]">
              {image && (
                <Image
                  className="rounded-lg w-full h-full mb4"
                  src={image}
                  width={250}
                  height={250}
                  alt="Avatar"
                />
              )}
              <label>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <span className="block border rounded-gray-300 rounded-lg p-2 text-center cursor-pointer">
                  Edit
                </span>
              </label>
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
              value={session?.data?.user?.email}
            />
            <input 
              type="tel" placeholder="Phone Number" 
              value={phone} onChange={ e => setPhone(e.target.value) }
            />
            <input
              type="text" placeholder="Address" 
              value={address} onChange={ e => setAddress(e.target.value) }
              />
            <div className="flex gap-2">
              <input 
                type="text" placeholder="City" 
                value={city} onChange={ e => setCity(e.target.value) }
                />
              <input 
                type="text" placeholder="postal code" 
                value={postalCode} onChange={ e => setPostalCode(e.target.value) }
                />
            </div>
            <button type="submit">Save</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
