import Image from "next/image";

const MenuItemTile = ({ onAddToCart, ...item }) => {
  const { image, description, name, basePrice, sizes, extraIngredientPrices } =
    item;

  return (
    <div className="bg-gray-200 p-4 rounded-lg text-center hover:bg-white hover:shadow-md transition-all">
      <div className="text-center">
        <Image
          width={150}
          height={0}
          className="max-h-auto max-h-24 block mx-auto"
          src={image}
          alt="Food Images"
        />
      </div>
      <h4 className="font-semibold text-xl my-3">{name}</h4>
      <p className="text-gray-600 text-sm line-clamp-3">{description}</p>
      <button
        type="button"
        onClick={onAddToCart}
        className="bg-primary text-white rounded-full px-6 py-2 mt-4"
      >
        {sizes?.length > 0 || extraIngredientPrices.length > 0 ? (
          <span>Add to cart (From ${basePrice})</span>
        ) : (
          <span>Add to cart ${basePrice}</span>
        )}
      </button>
    </div>
  );
};

export default MenuItemTile;
