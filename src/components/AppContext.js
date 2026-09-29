"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { createContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export const CartContext = createContext({});

export function cartProductUnitPrice(cartProduct) {
  let price = cartProduct.basePrice || 0;
  if (cartProduct.size) {
    price += cartProduct.size.price || 0;
  }
  if (cartProduct.extras?.length > 0) {
    for (const extra of cartProduct.extras) {
      price += extra.price || 0;
    }
  }
  return price;
}

export function cartProductPrice(cartProduct) {
  const unitPrice = cartProductUnitPrice(cartProduct);
  const qty = cartProduct.quantity || 1;
  return unitPrice * qty;
}

function areExtrasEqual(a = [], b = []) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  const aNames = a.map((e) => e.name).sort();
  const bNames = b.map((e) => e.name).sort();
  return aNames.every((val, idx) => val === bNames[idx]);
}

function CartProvider({ children }) {
  const [cartProducts, setCartProducts] = useState([]);
  const session = useSession();
  const userEmail = session?.data?.user?.email;
  const cartKey = userEmail ? `cart_${userEmail}` : "cart_guest";

  const ls = typeof window !== "undefined" ? window.localStorage : null;

  useEffect(() => {
    if (ls) {
      if (!userEmail) {
        setCartProducts([]);
        return;
      }
      const storedCart = ls.getItem(cartKey);
      if (storedCart) {
        try {
          const parsed = JSON.parse(storedCart);
          if (Array.isArray(parsed)) {
            const normalized = parsed.map((item) => ({
              ...item,
              quantity: item.quantity && item.quantity > 0 ? item.quantity : 1,
            }));
            setCartProducts(normalized);
          } else {
            setCartProducts([]);
          }
        } catch {
          setCartProducts([]);
        }
      } else {
        setCartProducts([]);
      }
    }
  }, [ls, cartKey, userEmail]);

  function saveCartProductsToLocalStorage(cartProducts) {
    if (ls) {
      ls.setItem(cartKey, JSON.stringify(cartProducts));
    }
  }

  function removeCartProduct(indexToRemove) {
    setCartProducts((prevCartProducts) => {
      const newCartProducts = prevCartProducts.filter(
        (v, index) => index !== indexToRemove
      );
      saveCartProductsToLocalStorage(newCartProducts);
      return newCartProducts;
    });
    toast.success("Product removed");
  }

  function clearCart() {
    setCartProducts([]);
    saveCartProductsToLocalStorage([]);
  }

  function addToCart(product, size = null, extras = [], quantity = 1) {
    setCartProducts((prevProducts) => {
      const existingIndex = prevProducts.findIndex((p) => {
        const sameId = (p._id && product._id) ? p._id === product._id : p.name === product.name;
        const sameSize = (p.size?.name || null) === (size?.name || null);
        const sameExtras = areExtrasEqual(p.extras, extras);
        return sameId && sameSize && sameExtras;
      });

      let newProducts;
      if (existingIndex > -1) {
        newProducts = [...prevProducts];
        const currentQty = newProducts[existingIndex].quantity || 1;
        newProducts[existingIndex] = {
          ...newProducts[existingIndex],
          quantity: currentQty + (quantity || 1),
        };
      } else {
        const cartProduct = { ...product, size, extras, quantity: quantity || 1 };
        newProducts = [...prevProducts, cartProduct];
      }

      saveCartProductsToLocalStorage(newProducts);
      return newProducts;
    });
    toast.success("Added to cart!");
  }

  function incrementCartProduct(index) {
    setCartProducts((prevProducts) => {
      if (!prevProducts[index]) return prevProducts;
      const updated = [...prevProducts];
      const currentQty = updated[index].quantity || 1;
      updated[index] = { ...updated[index], quantity: currentQty + 1 };
      saveCartProductsToLocalStorage(updated);
      return updated;
    });
  }

  function decrementCartProduct(index) {
    setCartProducts((prevProducts) => {
      if (!prevProducts[index]) return prevProducts;
      const currentQty = prevProducts[index].quantity || 1;
      if (currentQty <= 1) {
        const filtered = prevProducts.filter((_, idx) => idx !== index);
        saveCartProductsToLocalStorage(filtered);
        toast.info("Product removed from cart");
        return filtered;
      }
      const updated = [...prevProducts];
      updated[index] = { ...updated[index], quantity: currentQty - 1 };
      saveCartProductsToLocalStorage(updated);
      return updated;
    });
  }

  function updateCartProductQuantity(index, quantity) {
    setCartProducts((prevProducts) => {
      if (!prevProducts[index]) return prevProducts;
      if (quantity <= 0) {
        const filtered = prevProducts.filter((_, idx) => idx !== index);
        saveCartProductsToLocalStorage(filtered);
        toast.info("Product removed from cart");
        return filtered;
      }
      const updated = [...prevProducts];
      updated[index] = { ...updated[index], quantity };
      saveCartProductsToLocalStorage(updated);
      return updated;
    });
  }

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        setCartProducts,
        addToCart,
        removeCartProduct,
        incrementCartProduct,
        decrementCartProduct,
        updateCartProductQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

const AppContext = ({ children }) => {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </CartProvider>
    </SessionProvider>
  );
};

export default AppContext;
