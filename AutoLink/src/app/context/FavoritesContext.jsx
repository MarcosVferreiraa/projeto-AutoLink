import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../api";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext();
const favoritesContextFallback = {
  favoriteIds: [], isFavorite: () => false,
  addFavorite: async () => { throw new Error("FavoritesProvider não disponível."); },
  removeFavorite: async () => { throw new Error("FavoritesProvider não disponível."); },
  toggleFavorite: async () => { throw new Error("FavoritesProvider não disponível."); },
};

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState([]);

  useEffect(() => {
    if (!user) {
      setFavoriteIds([]);
      return;
    }
    apiFetch("/favorites")
      .then((result) => {
        const favorites = result.favorites || [];
        setFavoriteIds(favorites.map((favorite) => favorite.carId));
      })
      .catch((error) => console.error("Erro ao carregar favoritos:", error));
  }, [user]);

  async function addFavorite(carId) {
    await apiFetch(`/favorites/${carId}`, { method: "POST" });
    setFavoriteIds((previous) => [...previous, carId]);
  }

  async function removeFavorite(carId) {
    await apiFetch(`/favorites/${carId}`, { method: "DELETE" });
    setFavoriteIds((previous) => previous.filter((id) => id !== carId));
  }

  const isFavorite = (carId) => favoriteIds.includes(carId);
  async function toggleFavorite(carId) {
    if (!user) {
      alert("Faça login para favoritar");
      return;
    }
    if (isFavorite(carId)) await removeFavorite(carId);
    else await addFavorite(carId);
  }

  return <FavoritesContext.Provider value={{ favoriteIds, isFavorite, addFavorite, removeFavorite, toggleFavorite }}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  return useContext(FavoritesContext) || favoritesContextFallback;
}
