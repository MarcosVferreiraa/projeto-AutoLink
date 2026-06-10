import { createContext, useContext, useState, ReactNode } from 'react';

interface FavoritesContextType {
  favoriteIds: number[];
  addFavorite: (carId: number) => void;
  removeFavorite: (carId: number) => void;
  isFavorite: (carId: number) => boolean;
  toggleFavorite: (carId: number) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([1, 3]);

  const addFavorite = (carId: number) => {
    setFavoriteIds(prev => prev.includes(carId) ? prev : [...prev, carId]);
  };

  const removeFavorite = (carId: number) => {
    setFavoriteIds(prev => prev.filter(id => id !== carId));
  };

  const isFavorite = (carId: number) => favoriteIds.includes(carId);

  const toggleFavorite = (carId: number) => {
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
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
}
