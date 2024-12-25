"use client";
import UserTabs from "@/components/layout/UserTabs";
import React, { useEffect, useState } from "react";
import { UseProfile } from "@/components/UseProfile";
import DeleteButton from "@/components/DeleteButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CategoriesPage = () => {
  const [CategoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [editedCategory, setEditedCategory] = useState(null);

  const { loading: profileLoading, data: profileData } = UseProfile();

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    const response = fetch("/api/categories").then((res) => {
      res.json().then((categories) => {
        setCategories(categories);
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

        setCategoryName("");
        fetchCategories();
        setEditedCategory(null);

        if (response.ok) {
          resolve();
        } else {
          reject(); // Force rejection if the response is not OK
        }
      } catch (error) {
        reject(); // Reject on any network or other error
      }
    });

    await toast.promise(creationPromise, {
      pending: editedCategory
        ? "Updating Category"
        : "Creating your new category...",
      success: editedCategory
        ? "Category Updated"
        : "Category created successfully",
      error: "Error...", // This should show if the API route is missing or fails
    });

    // Clear input field after submission
    setCategoryName("");
  };

  async function handleDeleteClick(_id) {
    const promise = new Promise(async (resolve, reject) => {
      const response = await fetch(`/api/categories?_id=${_id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        resolve();
      } else {
        reject();
      }
    });

    await toast.promise(promise, {
      loading: "Deleting...",
      success: "Category deleted successfully",
      error: "Error deleting category",
    });

    fetchCategories(); // Refresh categories after deletion
  }

  if (profileLoading) {
    return "Loading user info...";
  }

  if (!profileData.admin) {
    return "Not an admin";
  }

  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <UserTabs isAdmin={profileData.admin} />

      <form className="mt-8" onSubmit={handleCategorySubmit}>
        <div className="flex gap-2 items-end">
          <div className="grow">
            <label>
              {editedCategory ? "Update category" : "New Category"}
              {editedCategory && (
                <>
                  {" "}
                  : <b>{editedCategory.name}</b>
                </>
              )}
            </label>
            <input
              type="text"
              value={CategoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>

          <div className="pb-2 flex gap-2">
            <button className="border border-primary" type="submit">
              {editedCategory ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setCategoryName("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>

      <div>
        <h2 className="mt-8 text-sm text-gray-500">Existing Categories</h2>
        {categories?.length > 0 &&
          categories.map((c, index) => (
            <div
              className="bg-gray-200 rounded-xl mb-1 p-2 px-4 flex gap-1 items-center"
              key={c._id}
            >
              <div className=" grow">{c.name}</div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setEditedCategory(c);
                    setCategoryName(c.name);
                  }}
                >
                  Edit
                </button>
                <DeleteButton
                  label="Delete"
                  onDelete={() => handleDeleteClick(c._id)}
                />
              </div>
            </div>
          ))}
      </div>

      <ToastContainer />
    </section>
  );
};

export default CategoriesPage;
