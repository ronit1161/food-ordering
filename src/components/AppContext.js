"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const CartContext = createContext({});

export function cartProductPrice(cartProduct) {
  let price = cartProduct.basePrice;
  if (cartProduct.size) {
    price += cartProduct.size.price;
  }
  if (cartProduct.extras?.length > 0) {
    for (const extra of cartProduct.extras) {
      price += extra.price;
    }
  }
  return price;
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
        setCartProducts(JSON.parse(storedCart));
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

  function addToCart(product, size = null, extras = []) {
    setCartProducts((prevProducts) => {
      const cartProduct = { ...product, size, extras };
      const newProducts = [...prevProducts, cartProduct];
      saveCartProductsToLocalStorage(newProducts);
      return newProducts;
    });
    toast.success("Added to cart!");
  }

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        setCartProducts,
        addToCart,
        removeCartProduct,
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
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  );
};

export default AppContext;
