import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { config } from './config.js';

export const createId = () => crypto.randomUUID();
export const now = () => new Date().toISOString();
export const createToken = (user) => jwt.sign({ uid: user.id }, config.jwtSecret, { expiresIn: '1h' });

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
  return {
    id: row.id,
    ...(typeof row.payload === 'string' ? JSON.parse(row.payload) : row.payload),
    status: row.status,
    createdAt: row.created_at,
  };
}
