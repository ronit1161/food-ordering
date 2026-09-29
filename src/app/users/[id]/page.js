"use client";
import UserForm from "@/components/layout/UserForm";
import UserTabs from "@/components/layout/UserTabs";
import SectionHeaders from "@/components/layout/SectionHeaders";
import { UseProfile } from "@/components/UseProfile";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function EditUserPage() {
  const { loading, data } = UseProfile();
  const [user, setUser] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetch("/api/profile?_id=" + id).then((res) => {
      res.json().then((user) => {
        setUser(user);
      });
    });
  }, [id]);

  async function handleSaveButtonClick(e, data) {
    e.preventDefault();

    try {
      const promise = new Promise(async (resolve, reject) => {
        try {
          const res = await fetch("/api/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, _id: id }),
          });
          if (res.ok) {
            resolve();
          } else {
            const errData = await res.json().catch(() => ({}));
            reject(new Error(errData.message || "Failed to update user."));
          }
        } catch (err) {
          reject(err);
        }
      });

      await toast.promise(promise, {
        pending: "Saving user...",
        success: "User updated successfully!",
        error: {
          render({ data }) {
            return data?.message || "Failed to update user.";
          },
        },
      });
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="py-24 text-center text-gray-500">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p>Loading user profile...</p>
      </div>
    );
  }

  if (!data?.admin) {
    return (
      <div className="py-24 text-center text-gray-500">
        <p className="text-xl font-bold text-gray-900">Access Denied</p>
        <p className="text-sm mt-1">You must be an administrator to edit users.</p>
      </div>
    );
  }

  return (
    <section className="py-6 max-w-4xl mx-auto">
      <UserTabs isAdmin={true} />

      <div className="mt-8">
        <SectionHeaders subHeader="User Administration" mainHeader="Edit User" />

        <div className="max-w-2xl mx-auto mt-8 bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-card">
          <UserForm user={user} OnSave={handleSaveButtonClick} />
        </div>
      </div>
    </section>
  );
}
