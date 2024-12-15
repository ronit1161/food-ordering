"use client";
import UserForm from "@/components/layout/UserForm";
import UserTabs from "@/components/layout/UserTabs";
import { UseProfile } from "@/components/UseProfile";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify"; // Import Toast
import "react-toastify/dist/ReactToastify.css"; // Import CSS for Toast

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
  }, []);

  async function handleSaveButtonClick(e, data) {
    e.preventDefault();

    const promise = new Promise(async (resolve, reject) => {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, _id: id }),
      });
      if (res.ok) resolve();
      else reject();
    });

    await toast.promise(promise, {
      loading: "Saving User...",
      success: "User saved successfully",
      error: "An Error has occurred",
    });
  }

  if (loading) {
    return "Loading user info ...";
  }

  if (!data.admin) {
    return "Not an admin";
  }
  return (
    <section className="mt-8 mx-auto max-w-2xl">
      <UserTabs isAdmin={true} />
  
      <div className="mt-8">
        <UserForm user={user} OnSave={handleSaveButtonClick} />
      </div>
  
      {/* Add ToastContainer here to render toasts */}
      <ToastContainer />
    </section>
  );
}


