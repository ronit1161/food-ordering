"use client";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import UserTabs from "@/components/layout/UserTabs";
import UserForm from "@/components/layout/UserForm";
import SectionHeaders from "@/components/layout/SectionHeaders";
import { toast } from 'react-toastify';

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

  const handleProfileInfoUpdate = async (e, data) => {
    e.preventDefault();
    let imageUrl = data.image;
    if (data.image && typeof data.image === "object" && data.image.link) {
      imageUrl = data.image.link;
    }

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, image: imageUrl }),
      });

      if (response.ok) {
        await getSession();
        const res = await fetch("/api/profile");
        if (res.ok) {
          const updatedData = await res.json();
          setUser(updatedData);
          setIsAdmin(updatedData.admin);
        }
        toast.success("Profile saved successfully!");
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  if (status === "loading") {
    return (
      <div className="py-24 text-center text-gray-500">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <section className="py-6 max-w-4xl mx-auto">
      <UserTabs isAdmin={isAdmin} />

      <div className="mt-8">
        <SectionHeaders subHeader="Account Settings" mainHeader="Your Profile" />
        
        <div className="max-w-2xl mx-auto mt-8 bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-card">
          <UserForm user={user} OnSave={handleProfileInfoUpdate} />
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
