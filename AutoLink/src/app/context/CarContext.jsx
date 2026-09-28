import { createContext, useCallback, useContext, useEffect, useState } from "react";
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
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  const fetchCars = useCallback(async (query = {}) => {
    const params = new URLSearchParams();

    if (query.page) params.set("page", String(query.page));
    if (query.limit) params.set("limit", String(query.limit));
    if (query.q) params.set("q", query.q);
    if (query.brand) params.set("brand", query.brand);
    if (query.model) params.set("model", query.model);
    if (query.fuel) params.set("fuel", query.fuel);
    if (query.transmission) params.set("transmission", query.transmission);
    if (query.color) params.set("color", query.color);
    if (query.city) params.set("city", query.city);
    if (query.minPrice !== undefined && query.minPrice !== "") params.set("minPrice", String(query.minPrice));
    if (query.maxPrice !== undefined && query.maxPrice !== "") params.set("maxPrice", String(query.maxPrice));
    if (query.minYear !== undefined && query.minYear !== "") params.set("minYear", String(query.minYear));
    if (query.maxYear !== undefined && query.maxYear !== "") params.set("maxYear", String(query.maxYear));

    const queryString = params.toString();
    const result = await apiFetch(queryString ? `/cars?${queryString}` : "/cars");
    const nextCars = result?.cars || [];
    const nextPagination = result?.pagination || {
      page: 1,
      limit: nextCars.length || 12,
      total: nextCars.length,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    };

    setCars(nextCars);
    setPagination(nextPagination);
    return result;
  }, []);

  useEffect(() => {
    fetchCars({ page: 1, limit: 12 })
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

  return <CarsContext.Provider value={{ cars, loading, pagination, fetchCars, getCarById, addCar, updateCar, removeCar, removeCarFromState }}>{children}</CarsContext.Provider>;
}

export const useCars = () => useContext(CarsContext) || { ...carsContextFallback, fetchCars: async () => ({ cars: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 1, hasNext: false, hasPrev: false } }), pagination: { page: 1, limit: 12, total: 0, totalPages: 1, hasNext: false, hasPrev: false } };
