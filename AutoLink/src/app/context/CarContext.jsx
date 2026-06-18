import { createContext, useContext, useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

const CarsContext = createContext(undefined);

export function CarsProvider({ children }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCars() {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'cars'));
        const carsData = [];
        querySnapshot.forEach((doc) => {
          carsData.push({ id: doc.id, ...doc.data() });
        });
        setCars(carsData);
      } catch (error) {
        console.error("Erro ao buscar carros:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, []);

  const getCarById = (id) => {
    // Busca robusta: converte ambos para string para evitar erro de tipo
    return cars.find(car => String(car.id) === String(id));
  };

  return (
    <CarsContext.Provider value={{ cars, getCarById, loading }}>
      {children}
    </CarsContext.Provider>
  );
}

export const useCars = () => useContext(CarsContext);