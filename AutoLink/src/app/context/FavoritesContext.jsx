import { createContext, useContext, useState } from 'react';

const FavoritesContext = createContext(undefined);

export function FavoritesProvider({ children }) {
  const [favoriteIds, setFavoriteIds] = useState([1, 3]);

  const addFavorite = (carId) => {
    setFavoriteIds(prev => prev.includes(carId) ? prev : [...prev, carId]);
  };

  const removeFavorite = (carId) => {
    setFavoriteIds(prev => prev.filter(id => id !== carId));
  };

  const isFavorite = (carId) => favoriteIds.includes(carId);

  const toggleFavorite = (carId) => {
    if (isFavorite(carId)) removeFavorite(carId);
    else addFavorite(carId);
  };

  return (
    <FavoritesContext.Provider value={{ favoriteIds, addFavorite, removeFavorite, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites deve ser usado dentro de um FavoritesProvider');
  }
  return context;
}