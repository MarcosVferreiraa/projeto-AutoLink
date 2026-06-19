import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where
} from "firebase/firestore";

import { db } from "../../firebase/firebase";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext();

const favoritesContextFallback = {
  favoriteIds: [],
  isFavorite: () => false,
  addFavorite: async () => {
    throw new Error("FavoritesProvider não disponível.");
  },
  removeFavorite: async () => {
    throw new Error("FavoritesProvider não disponível.");
  },
  toggleFavorite: async () => {
    throw new Error("FavoritesProvider não disponível.");
  }
};

export function FavoritesProvider({ children }) {
  const { user } = useAuth();

  const [favoriteIds, setFavoriteIds] = useState([]);
  const [favoriteDocs, setFavoriteDocs] = useState({});

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavoriteIds([]);
      setFavoriteDocs({});
    }
  }, [user]);

  async function loadFavorites() {
    try {
      const q = query(
        collection(db, "favorites"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);

      const ids = [];
      const docsMap = {};

      snapshot.forEach(docSnap => {
        const data = docSnap.data();

        ids.push(data.carId);

        docsMap[data.carId] = docSnap.id;
      });

      setFavoriteIds(ids);
      setFavoriteDocs(docsMap);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function addFavorite(carId) {
    try {
      const docRef = await addDoc(
        collection(db, "favorites"),
        {
          userId: user.uid,
          carId,
          createdAt: new Date()
        }
      );

      setFavoriteIds(prev => [...prev, carId]);

      setFavoriteDocs(prev => ({
        ...prev,
        [carId]: docRef.id
      }));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function removeFavorite(carId) {
    try {
      const favoriteDocId = favoriteDocs[carId];

      if (!favoriteDocId) return;

      await deleteDoc(
        doc(db, "favorites", favoriteDocId)
      );

      setFavoriteIds(prev =>
        prev.filter(id => id !== carId)
      );

      setFavoriteDocs(prev => {
        const copy = { ...prev };
        delete copy[carId];
        return copy;
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  function isFavorite(carId) {
    return favoriteIds.includes(carId);
  }

  async function toggleFavorite(carId) {
    if (!user) {
      alert("Faça login para favoritar");
      return;
    }

    if (isFavorite(carId)) {
      await removeFavorite(carId);
    } else {
      await addFavorite(carId);
    }
  }

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        isFavorite,
        addFavorite,
        removeFavorite,
        toggleFavorite
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  return context || favoritesContextFallback;
}