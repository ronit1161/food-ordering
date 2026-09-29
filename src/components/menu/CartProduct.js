import { cartProductPrice, cartProductUnitPrice } from "@/components/AppContext";
import Trash from "@/components/icons/Trash";
import Image from "next/image";

export default function CartProduct({ product, onRemove, onIncrement, onDecrement }) {
  const quantity = product.quantity || 1;
  const unitPrice = cartProductUnitPrice(product);
  const totalPrice = cartProductPrice(product);
  const isInteractive = !!onIncrement && !!onDecrement;

  return (
    <div className="flex items-center gap-4 py-4 px-2 hover:bg-orange-50/40 rounded-2xl transition-colors">
      {/* Thumbnail */}
      <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-orange-50 flex-shrink-0 border border-orange-100">
        {product.image ? (
          <Image
            fill
            className="object-cover"
            src={product.image}
            alt={product.name || "Dish thumbnail"}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-2xl">🍕</div>
        )}
      </div>

      {/* Info & Options */}
      <div className="grow min-w-0">
        <h3 className="font-display font-bold text-gray-900 truncate text-base">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2 flex-wrap mt-0.5">
          {product.size && (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-600">
              Size: {product.size.name}
            </span>
          )}
          {!isInteractive && quantity > 1 && (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-orange-100/70 text-primary">
              Qty: {quantity}
            </span>
          )}
        </div>

        {product.extras?.length > 0 && (
          <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-1">
            {product.extras.map((extra) => (
              <span
                key={extra.name}
                className="inline-block px-1.5 py-0.5 rounded bg-orange-50 text-primary text-[10px] font-medium"
              >
                +{extra.name} (₹{extra.price})
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Quantity Stepper (if on cart page) */}
      {isInteractive && (
        <div className="flex items-center gap-1.5 border border-orange-200/90 rounded-full px-2 py-1 bg-white shadow-2xs">
          <button
            type="button"
            onClick={onDecrement}
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-600 hover:text-primary hover:bg-orange-50 font-extrabold text-base transition-all active:scale-90"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="text-xs font-extrabold text-gray-950 min-w-[20px] text-center font-display">
            {quantity}
          </span>
          <button
            type="button"
            onClick={onIncrement}
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-600 hover:text-primary hover:bg-orange-50 font-extrabold text-base transition-all active:scale-90"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      )}

      {/* Item Price */}
      <div className="text-right whitespace-nowrap">
        <div className="text-base sm:text-lg font-extrabold text-gray-950 font-display">
          ₹{totalPrice}
        </div>
        {quantity > 1 && (
          <span className="text-[10px] text-gray-400 block font-normal">
            ₹{unitPrice} each
          </span>
        )}
      </div>

      {/* Remove Button */}
      {!!onRemove && (
        <div className="ml-1">
          <button
            type="button"
            onClick={onRemove}
            className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
            aria-label="Remove item"
          >
            <Trash />
          </button>
        </div>
      )}
    </div>
  );
}
