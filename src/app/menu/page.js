"use client";
import SectionHeaders from "@/components/layout/SectionHeaders";
import MenuItem from "@/components/menu/MenuItem";
import Loading from "@/components/layout/Loading";
import React, { useEffect, useState } from "react";

const MenuPage = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const [categoriesRes, menuItemsRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/menu-items")
        ]);

        const categoriesData = await categoriesRes.json();
        const menuItemsData = await menuItemsRes.json();

        setCategories(categoriesData);
        setMenuItems(menuItemsData);
      } catch (error) {
        console.error("Error fetching menu data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="mt-16">
        <Loading />
      </section>
    );
  }
  
  return (
    <section className="mt-16">
      {categories?.length > 0 ? (
        categories.map((c) => (
          <div key={c._id}>
            <div className="text-center mb-6">
              <SectionHeaders subHeader={c.name} />
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mt-6 mb-16">
              {menuItems
                .filter((item) => item.category === c._id)
                .map((item) => (
                  <MenuItem {...item} key={item._id} />
                ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500">No menu items found.</div>
      )}
    </section>
  );
};

export default MenuPage;
