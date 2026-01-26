"use client";
import { useContext, useState } from "react";
import { CartContext } from "../AppContext";
import { toast } from "react-hot-toast";
import MenuItemTile from "@/components/menu/MenuItemTile";
import Image from "next/image";
import { optimizeCloudinaryUrl } from "@/libs/utils";

export default function MenuItem({
  image,
  name,
  description,
  basePrice,
  sizes = [],
  extraIngredientPrices = [],
}) {
  const { addToCart } = useContext(CartContext);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSize, setSelectedSize] = useState(sizes?.[0] || null);
  const [selectedExtras, setSelectedExtras] = useState([]);

  function handleAddToCartButtonClick() {
    const hasOptions = sizes.length > 0 || extraIngredientPrices.length > 0;
    if (hasOptions && !showPopup) {
      setShowPopup(true);
      return;
    }

    if (!basePrice) {
      toast.error("Base price is missing for this item.");
      return;
    }

    let selectedPrice = basePrice;
    if (selectedSize) {
      selectedPrice += selectedSize.price;
    }
    if (selectedExtras?.length > 0) {
      selectedPrice += selectedExtras.reduce(
        (total, extra) => total + extra.price,
        0
      );
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
    toast.success("Added to cart!");
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
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div
              className="overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200"
            >
              <div className="aspect-video relative mb-4 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                <Image
                  src={optimizeCloudinaryUrl(image, { width: 400 })}
                  alt={name}
                  width={300}
                  height={200}
                  className="object-contain"
                />
              </div>
              <h2 className="text-2xl font-bold text-center mb-2 font-heading">{name}</h2>
              <p className="text-center text-gray-500 text-sm mb-6 leading-relaxed">
                {description}
              </p>
              {sizes?.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-center text-gray-700 font-semibold mb-2">Pick your size</h3>
                  <div className="space-y-2">
                    {sizes.map((size) => (
                      <label
                        className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${
                          selectedSize?.name === size.name 
                            ? "border-primary bg-orange-50 ring-1 ring-primary" 
                            : "border-gray-200 hover:border-gray-300 bg-gray-50"
                        }`}
                        key={size._id}
                      >
                        <input
                          type="radio"
                          name="size"
                          onClick={() => setSelectedSize(size)}
                          checked={selectedSize?.name === size.name}
                          className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                        />
                        <span className="font-medium">{size.name}</span>
                        <span className="ml-auto text-gray-500 text-sm font-semibold">+${basePrice + size.price}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              {extraIngredientPrices?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-center text-gray-700 font-semibold mb-2">Any Extras?</h3>
                  <div className="space-y-2">
                    {extraIngredientPrices.map((extraThing, index) => (
                      <label
                        className="flex items-center gap-3 p-4 border border-gray-200 bg-gray-50 rounded-xl cursor-pointer hover:bg-white hover:border-gray-300 transition-colors"
                        key={index}
                      >
                        <input
                          type="checkbox"
                          name={extraThing.name}
                          onClick={(e) => handleExtraThingClick(e, extraThing)}
                          className="w-4 h-4 text-primary rounded focus:ring-primary border-gray-300"
                        />
                        <span className="font-medium">{extraThing.name}</span>
                        <span className="ml-auto text-gray-500 text-sm font-semibold">+${extraThing.price}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <div className="sticky bottom-0 bg-white pt-4 mt-auto gap-3 flex flex-col">
                <button
                  onClick={handleAddToCartButtonClick}
                  type="button"
                  className="primary w-full py-4 text-lg shadow-xl shadow-primary/20"
                >
                  Add to Cart
                </button>
                <button 
                  className="w-full py-2 text-gray-500 font-medium hover:text-gray-800 transition-colors" 
                  onClick={() => setShowPopup(false)}
                >
                  Cancel
                </button>
              </div>
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
