"use client";

import { useState, useEffect } from "react";

const FAVORITES_KEY = "lazaro_imoveis_favoritos";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (_) {}
    setIsLoaded(true);

    const handleStorageChange = () => {
      try {
        const updated = localStorage.getItem(FAVORITES_KEY);
        if (updated) setFavorites(JSON.parse(updated));
      } catch (_) {}
    };

    window.addEventListener("favorites-updated", handleStorageChange);
    return () => window.removeEventListener("favorites-updated", handleStorageChange);
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event("favorites-updated"));
      } catch (_) {}
      return next;
    });
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return { favorites, toggleFavorite, isFavorite, isLoaded };
}
