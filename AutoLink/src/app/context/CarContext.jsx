import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch, jsonBody } from "../api";

const CarsContext = createContext(undefined);
const carsContextFallback = {
  cars: [], loading: true, getCarById: () => undefined,
  addCar: async () => { throw new Error("CarsProvider não disponível."); },
  updateCar: async () => { throw new Error("CarsProvider não disponível."); },
  removeCar: async () => { throw new Error("CarsProvider não disponível."); },
  removeCarFromState: () => {},
};

export function CarsProvider({ children }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/cars")
      .then((result) => setCars(result.cars || []))
      .catch((error) => console.error("Erro ao buscar carros:", error))
      .finally(() => setLoading(false));
  }, []);

  const getCarById = (id) => cars.find((car) => String(car.id) === String(id));
  const removeCarFromState = (id) => setCars((previous) => previous.filter((car) => String(car.id) !== String(id)));

  const addCar = async (carData) => {
    const result = await apiFetch("/cars", { method: "POST", body: jsonBody(carData) });
    const newCar = result.car;
    setCars((previous) => [...previous, newCar]);
    return newCar;
  };

  const updateCar = async (id, updatedData) => {
    const result = await apiFetch(`/cars/${id}`, { method: "PATCH", body: jsonBody(updatedData) });
    setCars((previous) => previous.map((car) => String(car.id) === String(id) ? { ...car, ...result.car } : car));
  };

  const removeCar = async (id) => {
    await apiFetch(`/cars/${id}`, { method: "DELETE" });
    removeCarFromState(id);
  };

  return <CarsContext.Provider value={{ cars, loading, getCarById, addCar, updateCar, removeCar, removeCarFromState }}>{children}</CarsContext.Provider>;
}

export const useCars = () => useContext(CarsContext) || carsContextFallback;
