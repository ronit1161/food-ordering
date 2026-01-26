"use client";
import { SessionProvider } from "next-auth/react";
import { createContext, useEffect, useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import { debounce } from "@/libs/utils";

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

const AppContext = ({ children }) => {
  const [cartProducts, setCartProducts] = useState([]);

  const ls = typeof window !== "undefined" ? window.localStorage : null;

  useEffect(() => {
    if (ls && ls.getItem("cart")) {
      setCartProducts(JSON.parse(ls.getItem("cart")));
    }
  }, [ls]);

  const debouncedSave = useMemo(
    () =>
      debounce((products) => {
        if (ls) {
          ls.setItem("cart", JSON.stringify(products));
        }
      }, 500),
    [ls]
  );

  function saveCartProductsToLocalStorage(products) {
    debouncedSave(products);
  }

  function removeCartProduct(indexToRemove) {
    setCartProducts(prevCartProducts => {
      const newCartProducts = prevCartProducts
        .filter((v,index) => index !== indexToRemove);
      saveCartProductsToLocalStorage(newCartProducts);
      return newCartProducts;
    });
    toast.success('Product removed');
  }

  function clearCart() {
    setCartProducts([]);
    saveCartProductsToLocalStorage([]);
  }

  function addToCart(product, size = null, extras = []) {
    setCartProducts((pervProducts) => {
      const cartProduct = {...product, size, extras };
      const newProducts = [...pervProducts, cartProduct];
      saveCartProductsToLocalStorage(newProducts);
      return newProducts;
    });
  }

  return (
    <SessionProvider>
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
    </SessionProvider>
  );
};

export default AppContext;
