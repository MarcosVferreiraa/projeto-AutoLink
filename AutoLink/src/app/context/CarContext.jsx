import { createContext, useContext, useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

const CarsContext = createContext(undefined);

const carsContextFallback = {
  cars: [],
  loading: true,
  getCarById: () => undefined,
  removeCarFromState: () => {},
  updateCar: async () => {
    throw new Error('CarsProvider não disponível.');
  },
  removeCar: async () => {
    throw new Error('CarsProvider não disponível.');
  }
};

export function CarsProvider({ children }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCars() {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'cars'));
        const carsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCars(carsData);
      } catch (error) {
        console.error("Erro ao buscar carros:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, []);

  const getCarById = (id) => cars.find(car => String(car.id) === String(id));

  const removeCarFromState = (id) => {
    setCars((prev) => prev.filter((car) => String(car.id) !== String(id)));
  };

  // Função necessária para atualizar no Firestore e no estado local
  const updateCar = async (id, updatedData) => {
    try {
      const carRef = doc(db, 'cars', id);
      await updateDoc(carRef, updatedData);
      setCars(prev => prev.map(car => (car.id === id ? { ...car, ...updatedData } : car)));
    } catch (error) {
      console.error("Erro ao atualizar no Firebase:", error);
      throw error;
    }
  };

  const removeCar = async (id) => {
    try {
      await deleteDoc(doc(db, 'cars', id));
      removeCarFromState(id);
    } catch (error) {
      console.error('Erro ao remover carro no Firebase:', error);
      throw error;
    }
  };

  return (
    <CarsContext.Provider value={{ cars, getCarById, loading, updateCar, removeCar, removeCarFromState }}>
      {children}
    </CarsContext.Provider>
  );
}

export const useCars = () => useContext(CarsContext) || carsContextFallback;