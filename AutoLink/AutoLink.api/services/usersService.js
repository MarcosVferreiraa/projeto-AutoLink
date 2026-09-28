import bcrypt from 'bcryptjs';

import { users } from '../database.js';
import { AppError } from '../errors.js';
import { toPublicUser } from '../utils.js';
import {
  validatePassword,
  validateUserUpdate,
} from '../validation.js';

const PASSWORD_SALT_ROUNDS = 12;

export async function updateOwnProfile(user, body) {
  const payload = validateUserUpdate(body);

  await users.updateOne(
    { id: user.id },
    {
      $set: {
        name: payload.name || user.name,
        phone: payload.phone,
      },
    }
  );

  const updatedUser = await users.findOne({ id: user.id });

  return {
    profile: toPublicUser(updatedUser),
  };
}

export async function changeOwnPassword(user, body) {
  const currentPassword = String(
    body?.currentPassword || ''
  );
  const newPassword = validatePassword(
    body?.newPassword,
    6
  );
  const isPasswordCorrect = bcrypt.compareSync(
    currentPassword,
    user.password_hash
  );

  if (!isPasswordCorrect) {
    throw new AppError(
      401,
      'auth/wrong-password',
      'Senha atual incorreta.'
    );
  }

  await users.updateOne(
    { id: user.id },
    {
      $set: {
        password_hash: bcrypt.hashSync(
          newPassword,
          PASSWORD_SALT_ROUNDS
        ),
      },
    }
  );
}

export async function deleteOwnAccount(user, password) {
  const isPasswordCorrect = bcrypt.compareSync(
    String(password || ''),
    user.password_hash
  );

  if (!isPasswordCorrect) {
    throw new AppError(
      401,
      'auth/wrong-password',
      'Senha incorreta.'
    );
  }

  await users.deleteOne({ id: user.id });
}

export async function listUsers() {
  const userDocuments = await users
    .find()
    .sort({ created_at: -1 })
    .toArray();

  return {
    users: userDocuments.map(toPublicUser),
  };
}

export async function updateUserRole(userId, role) {
  const nextRole = role === 'admin' ? 'admin' : 'user';

  await users.updateOne(
    { id: userId },
    {
      $set: {
        role: nextRole,
      },
    }
  );

  const user = await users.findOne({ id: userId });

  return {
    user: toPublicUser(user),
  };
}

export async function deleteUser(userId) {
  await users.deleteOne({ id: userId });
}
