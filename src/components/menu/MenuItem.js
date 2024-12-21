import { useContext, useState } from "react";
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

  const [showPopup, setShowPopup] = useState(false);
  const [selectedSize, setSelectedSize] = useState(sizes?.[0] || null);
  const [selectedExtras, setSelectedExtras] = useState([]);

  function handleAddToCartButtonClick() {
    const hasOptions = sizes.length > 0 || extraIngredientPrices.length > 0;
    if (hasOptions && !showPopup) {
      setShowPopup(true);
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
    toast.success("Added to cart!");
  }

  function handleExtraThingClick(e, extraThing) {
    const checked = e.target.checked;
    if (checked) {
      setSelectedExtras((prev) => [...prev, extraThing]);
    } else {
      setSelectedExtras((prev) => {
        return prev.filter((e) => e.name !== extraThing.name);
      });
    }
  }

  let selectedPrice = basePrice;
  if (selectedSize) {
    selectedPrice += selectedSize.price;
  }
  if (selectedExtras?.length > 0) {
    for (const extra of selectedExtras) {
      selectedPrice += extra.price;
    }
  }

  return (
    <>
      {showPopup && (
        <div
          onClick={() => setShowPopup(false)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="my-8 p-2 bg-white rounded-lg max-w-md"
          >
            <div
              className="overflow-y-scroll p-2"
              style={{ maxHeight: "calc(100vh - 100px)" }}
            >
              <Image
                src={image}
                alt={name}
                width={300}
                height={200}
                className="mx-auto"
              />
              <h2 className="text-lg font-bold text-center mb-2">{name}</h2>
              <p className="text-center text-gray-500 text-sm mb-2">
                {description}
              </p>
              {sizes?.length > 0 && (
                <div className="p-2">
                  <h3 className="text-center text-gray-700">Pick your size</h3>
                  {sizes.map((size, index) => (
                    <label
                      className="flex items-center gap-2 p-4 border rounded-md mb-1"
                      key={index}
                    >
                      <input
                        type="radio"
                        name="size"
                        onClick={() => setSelectedSize(size)}
                        checked={selectedSize?.name === size.name}
                      />
                      {size.name} ${basePrice + size.price}
                    </label>
                  ))}
                </div>
              )}
              {extraIngredientPrices?.length > 0 && (
                <div className="p-2">
                  <h3 className="text-center text-gray-700">Any Extras ?</h3>
                  {extraIngredientPrices.map((extraThing, index) => (
                    <label
                      className="flex items-center gap-2 p-4 border rounded-md mb-1"
                      key={index}
                    >
                      <input
                        type="checkbox"
                        name={extraThing.name}
                        onClick={(e) => handleExtraThingClick(e, extraThing)}
                      />
                      {extraThing.name} +${extraThing.price}
                    </label>
                  ))}
                </div>
              )}
              <button
                onClick={handleAddToCartButtonClick}
                type="button"
                className="primary sticky bottom-2"
              >
                Add to Cart {selectedPrice}
              </button>
              <button className="mt-2" onClick={() => setShowPopup(false)}>
                Cancel
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
