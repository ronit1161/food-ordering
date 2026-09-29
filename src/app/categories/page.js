"use client";
import UserTabs from "@/components/layout/UserTabs";
import SectionHeaders from "@/components/layout/SectionHeaders";
import React, { useEffect, useState } from "react";
import { UseProfile } from "@/components/UseProfile";
import DeleteButton from "@/components/DeleteButton";
import { toast } from "react-toastify";

const CategoriesPage = () => {
  const [CategoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [editedCategory, setEditedCategory] = useState(null);

  const { loading: profileLoading, data: profileData } = UseProfile();

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    fetch("/api/categories").then((res) => {
      res.json().then((categories) => {
        if (Array.isArray(categories)) {
          setCategories(categories);
        }
      });
    });
  }

  const handleCategorySubmit = async (e) => {
    e.preventDefault();

    if (!CategoryName.trim()) {
      toast.error("Category name cannot be empty.");
      return;
    }

    const data = { name: CategoryName };
    if (editedCategory) {
      data._id = editedCategory._id;
    }

    const creationPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await fetch("/api/categories", {
          method: editedCategory ? "PUT" : "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          setCategoryName("");
          setEditedCategory(null);
          fetchCategories();
          resolve();
        } else {
          const errData = await response.json().catch(() => ({}));
          reject(new Error(errData.message || errData.error || "Failed to save category."));
        }
      } catch (error) {
        reject(error);
      }
    });

    try {
      await toast.promise(creationPromise, {
        pending: editedCategory ? "Updating Category..." : "Creating Category...",
        success: editedCategory ? "Category updated!" : "Category created successfully!",
        error: {
          render({ data }) {
            return data?.message || "Failed to save category.";
          },
        },
      });
    } catch {}
  };

  async function handleDeleteClick(_id) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`/api/categories?_id=${_id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchCategories();
          resolve();
        } else {
          const errData = await response.json().catch(() => ({}));
          reject(new Error(errData.message || errData.error || "Error deleting category."));
        }
      } catch (error) {
        reject(error);
      }
    });

    try {
      await toast.promise(promise, {
        pending: "Deleting category...",
        success: "Category removed!",
        error: {
          render({ data }) {
            return data?.message || "Error deleting category.";
          },
        },
      });
    } catch {}
  }

  if (profileLoading) {
    return (
      <div className="py-24 text-center text-gray-500">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p>Loading categories...</p>
      </div>
    );
  }

  if (!profileData?.admin) {
    return (
      <div className="py-24 text-center text-gray-500">
        <p className="text-xl font-bold text-gray-900">Access Denied</p>
        <p className="text-sm mt-1">You must have administrator privileges to view this page.</p>
      </div>
    );
  }

  return (
    <section className="py-6 max-w-4xl mx-auto">
      <UserTabs isAdmin={profileData.admin} />

      <div className="max-w-2xl mx-auto mt-8">
        <SectionHeaders
          subHeader="Admin Controls"
          mainHeader={editedCategory ? "Edit Category" : "Categories Manager"}
        />

        {/* Create/Edit Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-card mt-8">
          <form onSubmit={handleCategorySubmit}>
            <label>
              {editedCategory ? `Update Name for "${editedCategory.name}"` : "New Category Name"}
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-stretch mt-1">
              <input
                type="text"
                placeholder="e.g. Artisanal Pizzas, Beverages"
                value={CategoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="mb-0 grow"
                required
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-2.5 rounded-2xl shadow-md shadow-orange-500/25 transition-all text-sm whitespace-nowrap"
                >
                  {editedCategory ? "Save Update" : "Create Category"}
                </button>
                {editedCategory && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditedCategory(null);
                      setCategoryName("");
                    }}
                    className="px-4 py-2.5 rounded-2xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Existing Categories List */}
        <div className="mt-10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 px-2">
            Active Categories ({categories.length})
          </h3>
          <div className="space-y-2.5">
            {categories?.length > 0 ? (
              categories.map((c) => (
                <div
                  key={c._id}
                  className="bg-white rounded-2xl p-4 px-5 border border-orange-100/70 shadow-xs flex items-center justify-between gap-4 hover:border-orange-200 hover:shadow-sm transition-all"
                >
                  <div className="font-bold text-gray-900 font-display flex items-center gap-2">
                    <span className="text-primary text-lg">📁</span>
                    <span>{c.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditedCategory(c);
                        setCategoryName(c.name);
                      }}
                      className="px-3.5 py-1.5 rounded-xl border border-gray-200 hover:border-primary hover:text-primary text-xs font-semibold transition-colors"
                    >
                      Edit
                    </button>
                    <DeleteButton
                      label="Delete"
                      onDelete={() => handleDeleteClick(c._id)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-gray-400 text-sm">No categories created yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesPage;
