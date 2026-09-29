"use client";
import UserTabs from "@/components/layout/UserTabs";
import SectionHeaders from "@/components/layout/SectionHeaders";
import { UseProfile } from "@/components/UseProfile";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import MenuItemForm from "@/components/layout/MenuItemForm";

export default function NewMenuItemPage() {
  const { loading, data } = UseProfile();
  const router = useRouter();

  async function handleFormSubmit(e, formData) {
    e.preventDefault();

    try {
      const savingPromise = new Promise(async (resolve, reject) => {
        try {
          const response = await fetch("/api/menu-items", {
            method: "POST",
            body: JSON.stringify(formData),
            headers: { "Content-Type": "application/json" },
          });

          if (response.ok) {
            resolve();
          } else {
            const errData = await response.json().catch(() => ({}));
            reject(new Error(errData.error || errData.message || "Failed to create menu item."));
          }
        } catch (err) {
          reject(err);
        }
      });

      await toast.promise(savingPromise, {
        pending: "Saving new dish...",
        success: "Dish created successfully!",
        error: {
          render({ data }) {
            return data?.message || "Couldn't save the item.";
          },
        },
      });

      router.push("/menu-items");
    } catch (err) {
      console.error("Save dish error:", err);
    }
  }

  if (loading) {
    return (
      <div className="py-24 text-center text-gray-500">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!data?.admin) {
    return (
      <div className="py-24 text-center text-gray-500">
        <p className="text-xl font-bold text-gray-900">Access Denied</p>
        <p className="text-sm mt-1">You must be an administrator to add menu items.</p>
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
              Add New Menu Item
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Add dish image, name, description, portion sizes, and extra toppings.
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
          <MenuItemForm onSubmit={handleFormSubmit} menuItem={null} />
        </div>
      </div>
    </section>
  );
}
