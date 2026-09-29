"use client";
import UserTabs from "@/components/layout/UserTabs";
import SectionHeaders from "@/components/layout/SectionHeaders";
import MenuItemForm from "@/components/layout/MenuItemForm";
import { UseProfile } from "@/components/UseProfile";
import DeleteButton from "@/components/DeleteButton";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";

export default function EditMenuItemPage() {
  const { id } = useParams();
  const [menuItem, setMenuItem] = useState(null);
  const { loading: profileLoading, data: profileData } = UseProfile();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/menu-items").then((res) => {
      res.json().then((items) => {
        if (Array.isArray(items)) {
          const item = items.find((i) => i._id === id);
          setMenuItem(item);
        }
      });
    });
  }, [id]);

  async function handleFormSubmit(e, data) {
    e.preventDefault();
    data = { ...data, _id: id };

    try {
      const savingPromise = new Promise(async (resolve, reject) => {
        try {
          const response = await fetch("/api/menu-items", {
            method: "PUT",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
          });

          if (response.ok) {
            resolve();
          } else {
            const errData = await response.json().catch(() => ({}));
            reject(new Error(errData.error || errData.message || "Failed to update item."));
          }
        } catch (err) {
          reject(err);
        }
      });

      await toast.promise(savingPromise, {
        pending: "Updating dish details...",
        success: "Dish updated successfully!",
        error: {
          render({ data }) {
            return data?.message || "Couldn't save changes.";
          },
        },
      });

      router.push("/menu-items");
    } catch (err) {
      console.error("Update error:", err);
    }
  }

  async function handleDeleteClick() {
    try {
      const promise = new Promise(async (resolve, reject) => {
        try {
          const res = await fetch("/api/menu-items?_id=" + id, {
            method: "DELETE",
          });
          if (res.ok) {
            resolve();
          } else {
            const errData = await res.json().catch(() => ({}));
            reject(new Error(errData.error || "Failed to delete item."));
          }
        } catch (err) {
          reject(err);
        }
      });

      await toast.promise(promise, {
        pending: "Removing dish...",
        success: "Dish deleted successfully!",
        error: {
          render({ data }) {
            return data?.message || "Unable to delete dish.";
          },
        },
      });

      router.push("/menu-items");
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  if (profileLoading) {
    return (
      <div className="py-24 text-center text-gray-500">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p>Loading dish information...</p>
      </div>
    );
  }

  if (!profileData?.admin) {
    return (
      <div className="py-24 text-center text-gray-500">
        <p className="text-xl font-bold text-gray-900">Access Denied</p>
        <p className="text-sm mt-1">You must be an administrator to edit menu items.</p>
      </div>
    );
  }

  return (
    <section className="py-6 max-w-4xl mx-auto">
      <UserTabs isAdmin={true} />

      <div className="mt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-950 font-display">
              Edit Menu Item
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Modify dish pricing, ingredients, and portion sizes.
            </p>
          </div>
          <Link
            href="/menu-items"
            className="text-xs font-bold text-primary hover:underline"
          >
            ← Back to all dishes
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-card">
          <MenuItemForm menuItem={menuItem} onSubmit={handleFormSubmit} />

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
            <DeleteButton
              label="Delete this dish"
              onDelete={handleDeleteClick}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
