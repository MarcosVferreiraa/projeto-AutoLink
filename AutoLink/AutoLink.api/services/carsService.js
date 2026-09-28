import { cars, users } from '../database.js';
import { readPayload } from '../utils.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;

function getQueryText(value) {
  if (Array.isArray(value)) {
    return typeof value[0] === 'string'
      ? value[0].trim()
      : '';
  }

  return typeof value === 'string'
    ? value.trim()
    : '';
}

function getOptionalNumber(value) {
  const text = getQueryText(value);

  if (!text) {
    return undefined;
  }

  const number = Number(text);
  return Number.isFinite(number) ? number : undefined;
}

function getPagination(query) {
  const requestedPage = Number(getQueryText(query.page));
  const requestedLimit = Number(getQueryText(query.limit));

  const page = Math.max(
    1,
    Number.isFinite(requestedPage)
      ? requestedPage
      : DEFAULT_PAGE
  );

  const limit = Math.min(
    MAX_LIMIT,
    Math.max(
      1,
      Number.isFinite(requestedLimit)
        ? requestedLimit
        : DEFAULT_LIMIT
    )
  );

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}

function getCarFilters(query) {
  return {
    search: getQueryText(query.q).toLowerCase(),
    brand: getQueryText(query.brand).toLowerCase(),
    model: getQueryText(query.model).toLowerCase(),
    fuel: getQueryText(query.fuel).toLowerCase(),
    transmission: getQueryText(query.transmission).toLowerCase(),
    color: getQueryText(query.color).toLowerCase(),
    city: getQueryText(query.city).toLowerCase(),
    minPrice: getOptionalNumber(query.minPrice),
    maxPrice: getOptionalNumber(query.maxPrice),
    minYear: getOptionalNumber(query.minYear),
    maxYear: getOptionalNumber(query.maxYear),
  };
}

function matchesCar(car, filters) {
  const payload = car.payload || {};
  const brand = String(payload.brand || '').toLowerCase();
  const model = String(payload.model || '').toLowerCase();
  const fuel = String(payload.fuel || '').toLowerCase();
  const transmission = String(payload.transmission || '').toLowerCase();
  const color = String(payload.color || '').toLowerCase();
  const city = String(payload.city || '').toLowerCase();
  const price = Number(payload.price || 0);
  const year = Number(payload.year || 0);

  const matchesSearch =
    !filters.search ||
    brand.includes(filters.search) ||
    model.includes(filters.search) ||
    city.includes(filters.search);

  return (
    matchesSearch &&
    (!filters.brand || brand === filters.brand) &&
    (!filters.model || model === filters.model) &&
    (!filters.fuel || fuel === filters.fuel) &&
    (!filters.transmission || transmission === filters.transmission) &&
    (!filters.color || color === filters.color) &&
    (!filters.city || city === filters.city) &&
    (filters.minPrice === undefined || price >= filters.minPrice) &&
    (filters.maxPrice === undefined || price <= filters.maxPrice) &&
    (filters.minYear === undefined || year >= filters.minYear) &&
    (filters.maxYear === undefined || year <= filters.maxYear)
  );
}

async function toPublicCar(car) {
  const owner = await users.findOne({
    id: car.created_by,
  });

  return {
    ...readPayload(car),
    userId: car.created_by,
    createdByName: owner?.name || '',
    createdByEmail: owner?.email || '',
  };
}

export async function listCars(query = {}) {
  const pagination = getPagination(query);
  const filters = getCarFilters(query);
  const allCars = await cars
    .find({})
    .sort({ created_at: -1 })
    .toArray();
  const filteredCars = allCars.filter((car) =>
    matchesCar(car, filters)
  );
  const paginatedCars = filteredCars.slice(
    pagination.skip,
    pagination.skip + pagination.limit
  );
  const publicCars = await Promise.all(
    paginatedCars.map(toPublicCar)
  );
  const total = filteredCars.length;

  return {
    cars: publicCars,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.max(
        1,
        Math.ceil(total / pagination.limit)
      ),
      hasNext: pagination.page * pagination.limit < total,
      hasPrev: pagination.page > 1,
    },
  };
}
