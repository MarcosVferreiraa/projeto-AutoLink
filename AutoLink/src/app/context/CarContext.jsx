
import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../firebase/firebase";

const CarsContext = createContext(undefined);

export function CarsProvider({ children }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] =
    useState(true);

  // =========================
  // CARREGAR CARROS
  // =========================
  async function loadCars() {
    try {
      const snapshot =
        await getDocs(
          collection(db, "cars")
        );

      const carsData =
        snapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...docItem.data(),
        }));

      setCars(carsData);
    } catch (error) {
      console.error(
        "Erro ao carregar carros:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCars();
  }, []);

  // =========================
  // ADICIONAR CARRO
  // =========================
  async function addCar(carData) {
    try {
      const docRef = await addDoc(
        collection(db, "cars"),
        {
          ...carData,
          createdAt:
            serverTimestamp(),
        }
      );

      setCars((prev) => [
        {
          id: docRef.id,
          ...carData,
        },
        ...prev,
      ]);
    } catch (error) {
      console.error(
        "Erro ao adicionar carro:",
        error
      );
    }
  }

  // =========================
  // REMOVER CARRO
  // =========================
  async function removeCar(id) {
    try {
      await deleteDoc(
        doc(db, "cars", id)
      );

      setCars((prev) =>
        prev.filter(
          (car) => car.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Erro ao remover carro:",
        error
      );
    }
  }

  // =========================
  // BUSCAR CARRO
  // =========================
  function getCarById(id) {
    return cars.find(
      (car) => car.id === id
    );
  }

  return (
    <CarsContext.Provider
      value={{
        cars,
        loading,
        addCar,
        removeCar,
        getCarById,
      }}
    >
      {children}
    </CarsContext.Provider>
  );
}

export function useCars() {
  const context =
    useContext(CarsContext);

  if (!context) {
    throw new Error(
      "useCars deve ser usado dentro de CarsProvider"
    );
  }

  return context;
}

