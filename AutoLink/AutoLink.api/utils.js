import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { config } from './config.js';

export function createId() {
  return crypto.randomUUID();
}

export function now() {
  return new Date().toISOString();
}

export function createToken(user) {
  return jwt.sign(
    { uid: user.id },
    config.jwtSecret,
    { expiresIn: '1h' }
  );
}

export function toPublicUser(user) {
  return {
    uid: user.id,
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    phoneNumber: user.phone,
    birthDate: user.birth_date,
    role: user.role,
    approved: Boolean(user.approved),
    createdAt: user.created_at,
  };
}

export function readPayload(row) {
  const payload =
    typeof row.payload === 'string'
      ? JSON.parse(row.payload)
      : row.payload;

  return {
    id: row.id,
    ...payload,
    status: row.status,
    createdAt: row.created_at,
  };
}
