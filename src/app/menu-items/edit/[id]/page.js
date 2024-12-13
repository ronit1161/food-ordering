"use client";
import UserTabs from "@/components/layout/UserTabs";
import MenuItemForm from "@/components/layout/MenuItemForm";
import { UseProfile } from "@/components/UseProfile";
import DeleteButton from "@/components/DeleteButton";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { redirect, useParams, useRouter } from "next/navigation";

export default function EditMenuItemPage() {
  const { id } = useParams();

  const [menuItem, setMenuItem] = useState(null);
  const [redirectToItems, setRedirectToItems] = useState(false);
  const { loading, data } = UseProfile();
  const router = useRouter(); // Initialize useRouter hook

  useEffect(() => {
    fetch("/api/menu-items").then((res) => {
      res.json().then((items) => {
        const item = items.find((i) => i._id === id);
        setMenuItem(item);
      });
    });
  }, []);

  async function handleFormSubmit(e, data) {
    e.preventDefault();
    data = { ...data, _id: id };

    const savingPromise = new Promise(async (resolve, reject) => {
      const response = await fetch("/api/menu-items", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        resolve();
      } else reject();
    });

    await toast.promise(savingPromise, {
      loading: "Saving this tasty item...",
      success: "Saved",
      error: "Couldn't save",
    });

    setRedirectToItems(true);
  }

  async function handleDeleteClick() {
    const promise = new Promise(async (resolve, reject) => {
      const res = await fetch("/api/menu-items?_id=" + id, {
        method: "DELETE",
      });
      if (res.ok) {
        resolve();
      } else {
        reject();
      }
    });

    await toast.promise(promise, {
      loading: "Deleting...",
      success: "Deleted",
      error: "Unable to delete",
    });

    setRedirectToItems(true);
  }

  // Check for redirect condition
  if (redirectToItems) {
    router.push("/menu-items"); // Client-side redirection
  }

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
        <Link href={"/menu-items"} className="button">
          <span>Show all menu items</span>
        </Link>
      </div>

      <MenuItemForm menuItem={menuItem} onSubmit={handleFormSubmit} />

      <div className="max-w-md mx-auto mt-4">
        <div className="max-w-xs ml-auto mt-4 pl-4">
          <DeleteButton
            label="Delete this menu item"
            onDelete={handleDeleteClick}
          />
        </div>
      </div>
    </section>
  );
}
