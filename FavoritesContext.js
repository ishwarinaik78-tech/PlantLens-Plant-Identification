import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../../firebase/firebaseConfig";

export const FavoritesContext = createContext({
  favorites: {},
  addToFavorites: () => {},
  removeFromFavorites: () => {},
});

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState({});

  // 🔥 Load favorites when user logs in
  const loadFavorites = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    try {
      const saved = await AsyncStorage.getItem(`favorites_${uid}`);
      if (saved) {
        setFavorites(JSON.parse(saved));
      } else {
        setFavorites({});
      }
    } catch (e) {
      console.log("Error loading favorites:", e);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      loadFavorites();
    });
    return unsubscribe;
  }, []);

  // 🔥 Save favorites per user
  const saveToStorage = async (updated) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    try {
      await AsyncStorage.setItem(
        `favorites_${uid}`,
        JSON.stringify(updated)
      );
    } catch (e) {
      console.log("Error saving favorites:", e);
    }
  };

  // ⭐ Add item
  const addToFavorites = (item) => {
    if (!item?.id) return;

    setFavorites((prev) => {
      const updated = { ...prev, [item.id]: item };
      saveToStorage(updated);
      return updated;
    });
  };

  // ⭐ Remove item
  const removeFromFavorites = (id) => {
    setFavorites((prev) => {
      const updated = { ...prev };
      delete updated[id];
      saveToStorage(updated);
      return updated;
    });
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
