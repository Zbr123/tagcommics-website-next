"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useAuth } from "@/src/hooks/use-auth";
import {
  addServerCartItem,
  clearServerCart,
  fetchServerCart,
  mapApiCartItemToLocal,
  removeServerCartItem,
  updateServerCartItem,
} from "@/src/lib/cart-api";

const LOCAL_CART_KEY = "comics-cart";

interface CartItem {
  id: string | number;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  image: string;
  pdfUrl?: string;
  category?: string;
  tags?: string[] | string;
  bookType?: string;
  itemType?: "comic" | "character_book";
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => Promise<void>;
  removeFromCart: (id: string | number) => Promise<void>;
  updateQuantity: (id: string | number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

function loadLocalCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem(LOCAL_CART_KEY);
  if (!saved) return [];
  try {
    return JSON.parse(saved) as CartItem[];
  } catch {
    return [];
  }
}

function saveLocalCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
}

function upsertLocalItem(
  prev: CartItem[],
  item: Omit<CartItem, "quantity">,
  quantity: number,
): CartItem[] {
  const existingItem = prev.find((cartItem) => cartItem.id === item.id);
  return existingItem
    ? prev.map((cartItem) =>
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + quantity } : cartItem,
      )
    : [...prev, { ...item, quantity }];
}

function inferItemType(id: string | number): "comic" | "character_book" {
  const raw = String(id).trim();
  return /^\d+$/.test(raw) ? "comic" : "character_book";
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { token, isLoaded } = useAuth();

  const syncFromServer = useCallback(async () => {
    if (!token) return;
    const apiItems = await fetchServerCart(token);
    setCartItems(apiItems.map(mapApiCartItemToLocal));
  }, [token]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!token) {
      setCartItems(loadLocalCart());
      return;
    }
    syncFromServer().catch((error) => {
      console.error("Failed to load server cart, falling back to local cart:", error);
      setCartItems(loadLocalCart());
    });
  }, [isLoaded, token, syncFromServer]);

  const addToCart = useCallback(
    async (item: Omit<CartItem, "quantity">, quantity: number = 1) => {
      if (!token) {
        setCartItems((prev) => {
          const next = upsertLocalItem(prev, item, quantity);
          saveLocalCart(next);
          return next;
        });
        return;
      }

      try {
        const item_type = item.itemType ?? inferItemType(item.id);
        await addServerCartItem(token, {
          item_type,
          item_id: String(item.id),
          quantity,
        });
        await syncFromServer();
      } catch (error) {
        console.error("Server add-to-cart failed; using local fallback:", error);
        setCartItems((prev) => {
          const next = upsertLocalItem(prev, item, quantity);
          saveLocalCart(next);
          return next;
        });
      }
    },
    [token, syncFromServer],
  );

  const removeFromCart = useCallback(
    async (id: string | number) => {
      if (!token) {
        setCartItems((prev) => {
          const next = prev.filter((item) => item.id !== id);
          saveLocalCart(next);
          return next;
        });
        return;
      }
      await removeServerCartItem(token, String(id));
      await syncFromServer();
    },
    [token, syncFromServer],
  );

  const updateQuantity = useCallback(
    async (id: string | number, quantity: number) => {
      if (quantity <= 0) {
        await removeFromCart(id);
        return;
      }
      if (!token) {
        setCartItems((prev) => {
          const next = prev.map((item) => (item.id === id ? { ...item, quantity } : item));
          saveLocalCart(next);
          return next;
        });
        return;
      }
      await updateServerCartItem(token, String(id), quantity);
      await syncFromServer();
    },
    [token, removeFromCart, syncFromServer],
  );

  const clearCart = useCallback(async () => {
    if (!token) {
      setCartItems([]);
      saveLocalCart([]);
      return;
    }
    await clearServerCart(token);
    await syncFromServer();
  }, [token, syncFromServer]);

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

