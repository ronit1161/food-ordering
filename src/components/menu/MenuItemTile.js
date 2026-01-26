import Image from "next/image";
import { optimizeCloudinaryUrl } from "@/libs/utils";

const MenuItemTile = ({ onAddToCart, ...item }) => {
  const { image, description, name, basePrice, sizes, extraIngredientPrices } =
    item;

  return (
    <div className="bg-white p-4 rounded-2xl text-center group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col h-full">
      <div className="text-center relative aspect-square mb-4 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center p-2">
        <Image
          width={200}
          height={200}
          className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-300"
          src={optimizeCloudinaryUrl(image, { width: 300, height: 300 })}
          alt={name}
        />
      </div>
      <h4 className="font-heading font-bold text-xl my-2 text-gray-900">{name}</h4>
      <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">{description}</p>
      <button
        type="button"
        onClick={onAddToCart}
        className="bg-primary text-white rounded-xl px-6 py-3 font-semibold shadow-md shadow-primary/20 hover:bg-orange-600 hover:shadow-lg hover:shadow-primary/30 active:scale-95 transition-all w-full mt-auto"
      >
        {sizes?.length > 0 || extraIngredientPrices.length > 0 ? (
          <span>Add to cart (from ${basePrice})</span>
        ) : (
          <span>Add to cart ${basePrice}</span>
        )}
      </button>
    </div>
  );
};

export default MenuItemTile;
