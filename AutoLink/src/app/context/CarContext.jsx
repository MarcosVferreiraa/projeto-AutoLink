import { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  addDoc
} from 'firebase/firestore';
import { db } from '../../firebase/firebase';

const CarsContext = createContext(undefined);

const carsContextFallback = {
  cars: [],
  loading: true,
  getCarById: () => undefined,
  addCar: async () => {
    throw new Error('CarsProvider não disponível.');
  },
  updateCar: async () => {
    throw new Error('CarsProvider não disponível.');
  },
  removeCar: async () => {
    throw new Error('CarsProvider não disponível.');
  },
  removeCarFromState: () => {}
};

export function CarsProvider({ children }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const withTimeout = (promise, timeoutMs = 12000) =>
      Promise.race([
        promise,
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout ao carregar carros.')), timeoutMs);
        })
      ]);

    async function fetchCars() {
      try {
        if (isMounted) setLoading(true);

        const querySnapshot = await withTimeout(getDocs(collection(db, 'cars')));

        const carsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const enrichedCarsData = await Promise.all(
          carsData.map(async (car) => {
            if (car?.createdByName || !car?.userId) {
              return car;
            }

            try {
              const userSnapshot = await withTimeout(getDoc(doc(db, 'users', String(car.userId))));

              if (!userSnapshot.exists()) {
                return car;
              }

              const userData = userSnapshot.data();

              const resolvedName = userData?.name || userData?.displayName || car?.createdByName || '';
              const resolvedEmail = userData?.email || car?.createdByEmail || '';

              const backfillPayload = {};

              if (!car?.createdByName && resolvedName) {
                backfillPayload.createdByName = resolvedName;
              }

              if (!car?.createdByEmail && resolvedEmail) {
                backfillPayload.createdByEmail = resolvedEmail;
              }

              if (Object.keys(backfillPayload).length > 0) {
                try {
                  await withTimeout(updateDoc(doc(db, 'cars', String(car.id)), backfillPayload), 8000);
                } catch (error) {
                  console.error('Erro ao atualizar criador do carro no Firestore:', error);
                }
              }

              return {
                ...car,
                createdByName: resolvedName,
                createdByEmail: resolvedEmail
              };
            } catch (error) {
              console.error('Erro ao carregar anunciante do carro:', error);
              return car;
            }
          })
        );

        if (isMounted) setCars(enrichedCarsData);
      } catch (error) {
        console.error('Erro ao buscar carros:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchCars();

    return () => {
      isMounted = false;
    };
  }, []);

  const getCarById = (id) =>
    cars.find(car => String(car.id) === String(id));

  const removeCarFromState = (id) => {
    setCars(prev =>
      prev.filter(car => String(car.id) !== String(id))
    );
  };

  const addCar = async (carData) => {
    try {
      const docRef = await addDoc(
        collection(db, 'cars'),
        carData
      );

      const newCar = {
        id: docRef.id,
        ...carData
      };

      setCars(prev => [...prev, newCar]);

      return newCar;
    } catch (error) {
      console.error('Erro ao adicionar carro no Firebase:', error);
      throw error;
    }
  };

  const updateCar = async (id, updatedData) => {
    try {
      const carRef = doc(db, 'cars', id);

      await updateDoc(carRef, updatedData);

      setCars(prev =>
        prev.map(car =>
          car.id === id
            ? { ...car, ...updatedData }
            : car
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar no Firebase:', error);
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
    <CarsContext.Provider
      value={{
        cars,
        loading,
        getCarById,
        addCar,
        updateCar,
        removeCar,
        removeCarFromState
      }}
    >
      {children}
    </CarsContext.Provider>
  );
}

export const useCars = () =>
  useContext(CarsContext) || carsContextFallback;