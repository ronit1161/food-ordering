"use client";
import UserTabs from "@/components/layout/UserTabs";
import { UseProfile } from "@/components/UseProfile";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import MenuItemForm from "@/components/layout/MenuItemForm";

export default function NewMenuItemPage() {
  const [redirectToItems, setRedirectToItems] = useState(false);
  const { loading, data } = UseProfile();
  const router = useRouter(); // Initialize useRouter hook

  async function handleFormSubmit(e, formData) {
    e.preventDefault();

    const savingPromise = new Promise(async (resolve, reject) => {
      const response = await fetch("/api/menu-items", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        resolve();
      } else reject();
    });

    await toast.promise(savingPromise, {
      loading: "Saving this tasty item...",
      success: "Saved successfully!",
      error: "Couldn't save the item",
    });

    setRedirectToItems(true); // Trigger redirect after save
  }

  // Redirect when redirectToItems is true
  useEffect(() => {
    if (redirectToItems) {
      router.push("/menu-items");
    }
  }, [redirectToItems, router]);

  if (loading) {
    return "Loading user info...";
  }

  if (!data.admin) {
    return "Not an admin...";
  }

  return (
    <section className="mt-8">
      <UserTabs isAdmin={true} />

      <div className="max-w-md mx-auto mt-8 text-center">
        <Link href={'/menu-items'} className="button">
          <span>Show all menu items</span>
        </Link>
      </div>

      <MenuItemForm onSubmit={handleFormSubmit} menuItem={null} />
    </section>
  );
}
