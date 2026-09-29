import Image from "next/image";

const MenuItemTile = ({ onAddToCart, ...item }) => {
  const { image, description, name, basePrice, sizes, extraIngredientPrices } = item;
  const hasOptions = sizes?.length > 0 || extraIngredientPrices?.length > 0;

  return (
    <div className="bg-white rounded-3xl p-5 border border-orange-100/80 shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col group relative">
      {/* Popular Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-white/90 backdrop-blur-md text-primary shadow-xs border border-orange-100">
          🔥 Special
        </span>
      </div>

      {/* Dish Image */}
      <div className="w-full h-44 relative rounded-2xl overflow-hidden bg-gradient-to-b from-orange-50/60 to-orange-100/30 mb-4 flex items-center justify-center">
        {image ? (
          <Image
            src={image}
            alt={name || "Dish image"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-108 transition-transform duration-500"
          />
        ) : (
          <div className="text-5xl">🍕</div>
        )}
      </div>

      {/* Dish Details */}
      <div className="flex-1 flex flex-col">
        <h4 className="font-display font-bold text-lg text-gray-950 group-hover:text-primary transition-colors line-clamp-1">
          {name}
        </h4>
        <p className="text-xs text-gray-500 line-clamp-2 mt-1.5 mb-4 leading-relaxed flex-1">
          {description}
        </p>

        {/* Pricing & Add to Cart Action */}
        <div className="pt-3 border-t border-orange-50 flex items-center justify-between gap-3 mt-auto">
          <div>
            {hasOptions && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block -mb-0.5">
                Starting at
              </span>
            )}
            <span className="text-xl font-extrabold text-gray-950 font-display">
              ₹{basePrice}
            </span>
          </div>

          <button
            type="button"
            onClick={onAddToCart}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-primary to-orange-500 hover:from-primary-dark hover:to-orange-600 text-white font-bold text-xs px-4 py-2.5 rounded-full shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/35 transition-all active:scale-[0.96]"
          >
            <span>+ Add</span>
            {hasOptions && <span className="text-[10px] opacity-80">(Options)</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemTile;
