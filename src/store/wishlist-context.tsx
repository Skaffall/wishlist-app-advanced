import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import type { WishInput, WishItem } from "@/src/types/wish";

const STORAGE_KEY = "@wishlist/items";

interface WishlistContextValue {
  items: WishItem[];
  isLoaded: boolean;
  activeItems: WishItem[];
  completedItems: WishItem[];
  addWish: (input: WishInput) => void;
  updateWish: (id: string, input: WishInput) => void;
  deleteWish: (id: string) => void;
  toggleComplete: (id: string) => void;
  restoreWish: (id: string) => void;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined,
);

export function WishlistProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<WishItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!isMounted) return;
        if (raw) {
          setItems(JSON.parse(raw) as WishItem[]);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoaded(true);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch(() => {});
  }, [items, isLoaded]);

  const addWish = useCallback((input: WishInput) => {
    const newWish: WishItem = {
      ...input,
      id: Crypto.randomUUID(),
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };
    setItems((prev) => [newWish, ...prev]);
  }, []);

  const updateWish = useCallback((id: string, input: WishInput) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...input } : item)),
    );
  }, []);

  const deleteWish = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item,
      ),
    );
  }, []);

  const restoreWish = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isCompleted: false } : item,
      ),
    );
  }, []);

  const activeItems = useMemo(
    () => items.filter((item) => !item.isCompleted),
    [items],
  );
  const completedItems = useMemo(
    () => items.filter((item) => item.isCompleted),
    [items],
  );

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      isLoaded,
      activeItems,
      completedItems,
      addWish,
      updateWish,
      deleteWish,
      toggleComplete,
      restoreWish,
    }),
    [
      items,
      isLoaded,
      activeItems,
      completedItems,
      addWish,
      updateWish,
      deleteWish,
      toggleComplete,
      restoreWish,
    ],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
