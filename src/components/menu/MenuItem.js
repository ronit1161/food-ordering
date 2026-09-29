"use client";
import { useContext, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CartContext } from "../AppContext";
import { toast } from "react-toastify";
import MenuItemTile from "@/components/menu/MenuItemTile";
import Image from "next/image";

export default function MenuItem({
  image,
  name,
  description,
  basePrice,
  sizes = [],
  extraIngredientPrices = [],
}) {
  const { addToCart } = useContext(CartContext);
  const session = useSession();
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSize, setSelectedSize] = useState(sizes?.[0] || null);
  const [selectedExtras, setSelectedExtras] = useState([]);

  // Calculate dynamic price in real-time
  let currentPrice = basePrice || 0;
  if (selectedSize?.price) {
    currentPrice += selectedSize.price;
  }
  if (selectedExtras?.length > 0) {
    currentPrice += selectedExtras.reduce((sum, extra) => sum + (extra.price || 0), 0);
  }

  function handleAddToCartButtonClick() {
    const isAuthenticated = session?.status === "authenticated" && !!session?.data?.user?.email;
    if (!isAuthenticated) {
      toast.info("Please log in to add items to your cart.");
      router.push("/login");
      return;
    }

    const hasOptions = sizes.length > 0 || extraIngredientPrices.length > 0;
    if (hasOptions && !showPopup) {
      setShowPopup(true);
      return;
    }

    if (!basePrice) {
      toast.error("Base price is missing for this item.");
      return;
    }

    addToCart(
      {
        image,
        name,
        description,
        basePrice,
        sizes,
        extraIngredientPrices,
      },
      selectedSize,
      selectedExtras
    );

    setShowPopup(false);
  }

  function handleExtraThingClick(e, extraThing) {
    const checked = e.target.checked;
    if (checked) {
      setSelectedExtras((prev) => [...prev, extraThing]);
    } else {
      setSelectedExtras((prev) =>
        prev.filter((e) => e.name !== extraThing.name)
      );
    }
  }

  return (
    <>
      {showPopup && (
        <div
          onClick={() => setShowPopup(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] shadow-2xl border border-orange-100 flex flex-col overflow-hidden relative animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-md text-gray-500 hover:text-gray-900 border border-gray-100 flex items-center justify-center text-sm font-bold transition-all"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Scrollable Modal Content */}
            <div className="overflow-y-auto p-6 space-y-6">
              {/* Dish Visual Header */}
              <div className="w-full h-48 relative rounded-2xl overflow-hidden bg-gradient-to-b from-orange-50 to-orange-100/40">
                {image ? (
                  <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-5xl">🍕</div>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold font-display text-gray-900">{name}</h2>
                <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">{description}</p>
              </div>

              {/* Sizes Selection */}
              {sizes?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    1. Choose Portion Size
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {sizes.map((size) => {
                      const isSelected = selectedSize?.name === size.name;
                      return (
                        <label
                          key={size._id || size.name}
                          className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center cursor-pointer transition-all ${
                            isSelected
                              ? "border-primary bg-orange-50/70 text-primary shadow-xs ring-2 ring-primary/20"
                              : "border-gray-200 hover:border-orange-200 hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          <input
                            type="radio"
                            name="size"
                            className="sr-only"
                            onChange={() => setSelectedSize(size)}
                            checked={isSelected}
                          />
                          <span className="text-sm font-bold">{size.name}</span>
                          <span className="text-xs text-gray-500 mt-0.5">
                            ₹{basePrice + size.price}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Extras Selection */}
              {extraIngredientPrices?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    2. Add Extra Toppings & Extras
                  </h3>
                  <div className="space-y-2">
                    {extraIngredientPrices.map((extraThing, index) => {
                      const isChecked = selectedExtras.some((e) => e.name === extraThing.name);
                      return (
                        <label
                          key={index}
                          className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                            isChecked
                              ? "border-primary bg-orange-50/50 text-primary shadow-xs"
                              : "border-gray-200 hover:border-orange-200 hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              name={extraThing.name}
                              checked={isChecked}
                              onChange={(e) => handleExtraThingClick(e, extraThing)}
                              className="w-4 h-4 rounded text-primary focus:ring-primary/20 border-gray-300"
                            />
                            <span className="text-sm font-medium">{extraThing.name}</span>
                          </div>
                          <span className="text-xs font-bold text-gray-600">
                            +₹{extraThing.price}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Action Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/80 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs text-gray-500 block">Total Amount</span>
                <span className="text-2xl font-extrabold text-gray-950 font-display">
                  ₹{currentPrice}
                </span>
              </div>
              <button
                onClick={handleAddToCartButtonClick}
                type="button"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-orange-500 hover:from-primary-dark hover:to-orange-600 text-white font-bold px-7 py-3 rounded-full shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all active:scale-[0.98]"
              >
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <MenuItemTile
        onAddToCart={handleAddToCartButtonClick}
        image={image}
        name={name}
        description={description}
        basePrice={basePrice}
        sizes={sizes}
        extraIngredientPrices={extraIngredientPrices}
      />
    </>
  );
}
