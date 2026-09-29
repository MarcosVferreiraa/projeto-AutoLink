
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
  const rawValue =
    payload.value ?? payload.amount ?? payload.price;
  const value = Number(rawValue);
  const originalPrice = Number(
    payload.originalPrice ?? payload.carPrice ?? value
  );
  const proposalType = normalizeText(
    payload.proposalType,
    'cash'
  ).toLowerCase();
  const normalizedStatus = normalizeText(
    payload.status,
    'pending'
  ).toLowerCase();

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

  if (!Number.isFinite(originalPrice) || originalPrice <= 0) {
    throw badRequest(
      'Preço original do veículo inválido.',
      null,
      'proposals/invalid-payload'
    );
  }

  if (!['cash', 'financing'].includes(proposalType)) {
    throw badRequest(
      'Tipo de proposta inválido.',
      null,
      'proposals/invalid-payload'
    );
  }

  if (
    !['pending', 'approved', 'rejected'].includes(
      normalizedStatus
    )
  ) {
    throw badRequest(
      'Status da proposta inválido.',
      null,
      'proposals/invalid-payload'
    );
  }

  const financing =
    proposalType === 'financing' &&
    payload.financing &&
    typeof payload.financing === 'object'
      ? {
          downPayment: Number(payload.financing.downPayment || 0),
          months: Number(payload.financing.months || 0),
          interestRate: Number(payload.financing.interestRate || 0),
          monthlyPayment: Number(payload.financing.monthlyPayment || 0),
          financedAmount: Number(payload.financing.financedAmount || 0),
          totalInterest: Number(payload.financing.totalInterest || 0),
          totalAmount: Number(payload.financing.totalAmount || 0),
        }
      : null;

  if (
    proposalType === 'financing' &&
    (!financing ||
      !Number.isFinite(financing.downPayment) ||
      !Number.isFinite(financing.months) ||
      !Number.isFinite(financing.interestRate) ||
      !Number.isFinite(financing.monthlyPayment) ||
      !Number.isFinite(financing.financedAmount) ||
      !Number.isFinite(financing.totalInterest) ||
      !Number.isFinite(financing.totalAmount) ||
      financing.downPayment < 0 ||
      financing.months <= 0 ||
      financing.interestRate < 0 ||
      financing.monthlyPayment <= 0 ||
      financing.financedAmount <= 0 ||
      financing.totalInterest < 0 ||
      financing.totalAmount <= 0)
  ) {
    throw badRequest(
      'Dados de financiamento inválidos.',
      null,
      'proposals/invalid-payload'
    );
  }

  return {
    message,
    value,
    price: value,
    originalPrice,
    proposalType,
    financing,
    status: normalizedStatus,
    carId: String(payload.carId ?? ''),
    carImage: normalizeText(payload.carImage),
    carBrand: normalizeText(payload.carBrand),
    carModel: normalizeText(payload.carModel),
    carYear: payload.carYear ?? '',
    buyerEmail: normalizeText(payload.buyerEmail),
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

