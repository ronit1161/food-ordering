"use client";
import EditableImage from "@/components/layout/EditableImage";
import MenuItemPriceProps from "@/components/layout/MenuItemPriceProps";
import { useEffect, useState } from "react";
import { toast } from "react-toastify"; // Toastify for feedback

export default function MenuItemForm({ onSubmit, menuItem }) {
  const [image, setImage] = useState(menuItem?.image || "");
  const [name, setName] = useState(menuItem?.name || "");
  const [description, setDescription] = useState(menuItem?.description || "");
  const [basePrice, setBasePrice] = useState(menuItem?.basePrice || "");
  const [sizes, setSizes] = useState(menuItem?.sizes || []);
  const [selectedCategory, setSelectedCategory] = useState(
    menuItem?.category || ""
  );
  const [categories, setCategories] = useState([]); // Initialize categories as an empty array
  const [extraIngredientPrices, setExtraIngredientPrices] = useState(
    menuItem?.extraIngredientPrices || []
  );

  // Fetch categories for the dropdown
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data); // Only set categories if data is an array
        } else {
          console.error("Unexpected data format:", data);
        }
      })
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);

  // Form validation before submission
  const validateForm = () => {
    if (!name || !description || !basePrice) {
      toast.error("Please fill in all required fields.");
      return false;
    }
    if (isNaN(basePrice)) {
      toast.error("Base price must be a valid number.");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    if (!validateForm()) {
      return;
    }

    const menuItemData = {
      image,
      name,
      description,
      basePrice: parseFloat(basePrice),
      sizes,
      category: selectedCategory,
      extraIngredientPrices,
    };

    // Call onSubmit with form data
    onSubmit(e, menuItemData);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-2xl mx-auto">
      <div
        className="grid items-start gap-4"
        style={{ gridTemplateColumns: "0.3fr 0.7fr" }}
      >
        <div>
          <EditableImage link={image} setLink={setImage} />
        </div>

        <div className="grow">
          <label>Item name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label>Category</label>
          <select
            value={selectedCategory} // Bind to the selected category
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories?.length > 0 &&
              categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
          </select>

          <label>Base Price</label>
          <input
            type="text"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            required
          />

          <MenuItemPriceProps
            name={"Sizes"}
            addLabel={"Add Item Size"}
            props={sizes}
            setProps={setSizes}
          />

          <MenuItemPriceProps
            name={"Extra ingredients"}
            addLabel={"Add ingredient prices"}
            props={extraIngredientPrices}
            setProps={setExtraIngredientPrices}
          />

          <button type="submit">Save</button>
        </div>
      </div>
    </form>
  );
}
