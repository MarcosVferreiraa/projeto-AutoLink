import bcrypt from 'bcryptjs';

import { users } from '../database.js';
import { AppError } from '../errors.js';
import {
  createId,
  createToken,
  now,
  toPublicUser,
} from '../utils.js';
import {
  validateLogin,
  validateUserRegistration,
} from '../validation.js';

const PASSWORD_SALT_ROUNDS = 12;

function createAuthResponse(user) {
  const publicUser = toPublicUser(user);

  return {
    token: createToken(user),
    user: publicUser,
    profile: publicUser,
  };
}

export async function registerUser(body) {
  const input = validateUserRegistration(body);
  const existingUser = await users.findOne({
    email: input.email,
  });

  if (existingUser) {
    throw new AppError(
      409,
      'auth/email-already-in-use',
      'Este e-mail já está cadastrado.'
    );
  }

  const user = {
    id: createId(),
    name: input.name,
    email: input.email,
    password_hash: bcrypt.hashSync(
      input.password,
      PASSWORD_SALT_ROUNDS
    ),
    phone: input.phone,
    birth_date: input.birthDate,
    role: 'user',
    approved: false,
    created_at: now(),
  };

  await users.insertOne(user);
  return createAuthResponse(user);
}

export async function loginUser(body) {
  const { email, password } = validateLogin(body);
  const user = await users.findOne({ email });
  const passwordMatches =
    user && bcrypt.compareSync(password, user.password_hash);

  if (!passwordMatches) {
    throw new AppError(
      401,
      'auth/invalid-credential',
      'E-mail ou senha incorretos.'
    );
  }

  return createAuthResponse(user);
}

export function getCurrentUser(user) {
  const publicUser = toPublicUser(user);

  return {
    user: publicUser,
    profile: publicUser,
  };
}
