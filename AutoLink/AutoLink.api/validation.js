
import { badRequest } from './errors.js';

export function normalizeText(value, fallback = '') {
  return typeof value === 'string'
    ? value.trim()
    : fallback;
}

function ensureRequired(value, message, code) {
  if (
    value === undefined ||
    value === null ||
    String(value).trim() === ''
  ) {
    throw badRequest(message, null, code);
  }
}

export function validateEmail(email) {
  const value = normalizeText(email).toLowerCase();

  ensureRequired(
    value,
    'E-mail obrigatório.',
    'auth/invalid-email'
  );

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  if (!isValid) {
    throw badRequest(
      'E-mail inválido.',
      null,
      'auth/invalid-email'
    );
  }

  return value;
}

export function validatePassword(password, minLength = 6) {
  const value = String(password ?? '').trim();

  ensureRequired(
    value,
    'Senha obrigatória.',
    'auth/invalid-password'
  );

  if (value.length < minLength) {
    throw badRequest(
      `A senha deve ter pelo menos ${minLength} caracteres.`,
      null,
      'auth/invalid-password'
    );
  }

  return value;
}

export function validateUserRegistration(body) {
  const name = normalizeText(body?.name);

  if (!name) {
    throw badRequest(
      'Nome obrigatório.',
      null,
      'auth/invalid-name'
    );
  }

  return {
    name,
    email: validateEmail(body?.email),
    password: validatePassword(body?.password),
    phone: normalizeText(body?.phone),
    birthDate: normalizeText(body?.birthDate),
  };
}

export function validateLogin(body) {
  return {
    email: validateEmail(body?.email),
    password: String(body?.password ?? '').trim(),
  };
}

export function validateCarPayload(body) {
  const payload =
    body && typeof body === 'object'
      ? body
      : {};

  const requiredFields = [
    'brand',
    'model',
    'year',
    'price',
  ];

  for (const field of requiredFields) {
    ensureRequired(
      payload[field],
      `Campo obrigatório ausente: ${field}.`,
      'cars/invalid-payload'
    );
  }

  const year = Number(payload.year);

  if (
    !Number.isInteger(year) ||
    year < 1900 ||
    year > 2100
  ) {
    throw badRequest(
      'Ano do veículo inválido.',
      null,
      'cars/invalid-payload'
    );
  }

  const price = Number(payload.price);

  if (!Number.isFinite(price) || price <= 0) {
    throw badRequest(
      'Preço do veículo inválido.',
      null,
      'cars/invalid-payload'
    );
  }

  const mileage = Number(payload.mileage);

  return {
    ...payload,
    brand: normalizeText(payload.brand),
    model: normalizeText(payload.model),
    year,
    price,

    image: normalizeText(payload.image),
    mileage:
      Number.isFinite(mileage) && mileage >= 0
        ? mileage
        : 0,

    fuel: normalizeText(
      payload.fuel,
      'Indefinido'
    ),

    transmission: normalizeText(
      payload.transmission,
      'Indefinida'
    ),

    color: normalizeText(payload.color),
    city: normalizeText(payload.city),
    description: normalizeText(payload.description),

    features: Array.isArray(payload.features)
      ? payload.features
      : [],
  };
}

export function validateProposalPayload(body) {
  const payload =
    body && typeof body === 'object'
      ? body
      : {};

  const message = normalizeText(payload.message);
  const value = Number(payload.value);

  if (!message) {
    throw badRequest(
      'Mensagem da proposta obrigatória.',
      null,
      'proposals/invalid-payload'
    );
  }

  if (!Number.isFinite(value) || value <= 0) {
    throw badRequest(
      'Valor da proposta inválido.',
      null,
      'proposals/invalid-payload'
    );
  }

  return {
    message,
    value,
    carId: String(payload.carId ?? ''),
    userId: String(payload.userId ?? ''),
  };
}

export function validateUserUpdate(body) {
  const payload =
    body && typeof body === 'object'
      ? body
      : {};

  const name = normalizeText(payload.name);
  const phone = normalizeText(payload.phone);

  if (
    payload.name !== undefined &&
    !name
  ) {
    throw badRequest(
      'Nome não pode ficar vazio.',
      null,
      'users/invalid-payload'
    );
  }

  return {
    name,
    phone,
  };
}

