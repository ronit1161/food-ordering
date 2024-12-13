"use client";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import UserTabs from "@/components/layout/UserTabs";
import UserForm from "@/components/layout/UserForm";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfilePage = () => { 

  const session = useSession();

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const { status } = session;
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") { 
      fetch("/api/profile").then((response) => {
        response.json().then((data) => {
          setUser(data);
          setIsAdmin(data.admin);
        });
      });
    }
  }, [session, status]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleProfileInfoUpdate = async (e) => {
    e.preventDefault();
    let imageUrl = image;
    if (image && typeof image === "object" && image.link) {
      imageUrl = image.link;
    }

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedSession = await getSession();
        toast.success("Profile updated successfully!", {
          autoClose: 3000,
        });
      } else {
        toast.error("Failed to update profile. Please try again.", {
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.", {
        autoClose: 3000,
      });
    }
  };

  if (status === "loading") {
    return "Loading Profile ....";
  }

  return (
    <section className="mt-8">
      <UserTabs isAdmin={isAdmin} />

      <div className="max-w-2xl mx-auto mt-8">
        <UserForm user={user} OnSave={handleProfileInfoUpdate} />
      </div>

      <ToastContainer /> {/* Add this to display Toasts */}
    </section>
  );
};

export default ProfilePage;
