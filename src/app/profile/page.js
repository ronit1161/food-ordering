"use client";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import UserTabs from "@/components/layout/UserTabs";
import UserForm from "@/components/layout/UserForm";
import { toast } from 'react-hot-toast';

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
  
    const savingPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, image: imageUrl }),
        });
    
        if (response.ok) {
          const updatedSession = await getSession(); // Refresh session
          resolve(); 
        } else {
          reject();
        }
      } catch (error) {
        reject();
      }
    });

    await toast.promise(savingPromise, {
      loading: 'Saving...',
      success: 'Profile updated!',
      error: 'Error saving profile',
    });
  };

  if (status === "loading") {
    return "Loading Profile ....";
  }

  return (
    <section className="mt-8">
      <UserTabs isAdmin={isAdmin} />

      <div className="max-w-2xl mx-auto mt-8">
        <UserForm user={user} onSave={handleProfileInfoUpdate} />
      </div>
    </section>
  );
};

export default ProfilePage;
