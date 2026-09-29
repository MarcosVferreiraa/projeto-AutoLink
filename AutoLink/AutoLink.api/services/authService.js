import { createHash, randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

import { config } from '../config.js';
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
  validateEmail,
  validatePassword,
  validateUserRegistration,
} from '../validation.js';

const PASSWORD_SALT_ROUNDS = 12;
const PASSWORD_RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
const PASSWORD_RESET_RESEND_DELAY_MS = 60 * 1000;
const PASSWORD_RESET_MESSAGE = 'Se o e-mail estiver cadastrado, enviaremos um link para redefinir a senha.';

function isSmtpConfigured() {
  return Boolean(
    config.smtp.host &&
    config.smtp.port &&
    config.smtp.user &&
    config.smtp.password &&
    config.smtp.from
  );
}

function hashResetToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

function createMailer() {
  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.password,
    },
  });
}

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

export async function requestPasswordReset(rawEmail) {
  const email = validateEmail(rawEmail);

  if (!isSmtpConfigured()) {
    throw new AppError(
      503,
      'auth/password-reset-unavailable',
      'O envio de recuperação de senha não está configurado.'
    );
  }

  const user = await users.findOne({ email });
  if (!user) return { message: PASSWORD_RESET_MESSAGE };

  const lastRequestedAt = new Date(
    user.password_reset_requested_at || 0
  ).getTime();
  if (Date.now() - lastRequestedAt < PASSWORD_RESET_RESEND_DELAY_MS) {
    return { message: PASSWORD_RESET_MESSAGE };
  }

  const token = randomBytes(32).toString('hex');
  const tokenHash = hashResetToken(token);
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL_MS);

  await users.updateOne(
    { id: user.id },
    {
      $set: {
        password_reset_token_hash: tokenHash,
        password_reset_expires_at: expiresAt,
        password_reset_requested_at: new Date(),
      },
    }
  );

  const resetUrl = new URL('/redefinir-senha', `${config.appUrl}/`);
  resetUrl.searchParams.set('token', token);

  try {
    await createMailer().sendMail({
      from: config.smtp.from,
      to: user.email,
      subject: 'Redefinição de senha AutoLink',
      text: `Acesse este link para redefinir sua senha: ${resetUrl.toString()}\n\nO link expira em 1 hora e só pode ser usado uma vez.`,
      html: `<p>Recebemos uma solicitação para redefinir sua senha.</p><p><a href="${resetUrl.toString()}">Criar nova senha</a></p><p>O link expira em 1 hora e só pode ser usado uma vez.</p>`,
    });
  } catch (error) {
    console.error('Erro ao enviar e-mail de redefinição:', error);
    await users.updateOne(
      { id: user.id, password_reset_token_hash: tokenHash },
      {
        $unset: {
          password_reset_token_hash: '',
          password_reset_expires_at: '',
          password_reset_requested_at: '',
        },
      }
    ).catch(() => {});
    throw new AppError(
      503,
      'auth/password-reset-unavailable',
      'Não foi possível enviar o e-mail de recuperação.'
    );
  }

  return { message: PASSWORD_RESET_MESSAGE };
}

export async function completePasswordReset(body) {
  const token = String(body?.token || '').trim();
  const password = validatePassword(body?.password);

  if (!/^[a-f0-9]{64}$/i.test(token)) {
    throw new AppError(
      400,
      'auth/invalid-reset-token',
      'O link de redefinição é inválido ou expirou.'
    );
  }

  const tokenHash = hashResetToken(token);
  const validTokenQuery = {
    password_reset_token_hash: tokenHash,
    password_reset_expires_at: { $gt: new Date() },
  };
  const user = await users.findOne(validTokenQuery);

  if (!user) {
    throw new AppError(
      400,
      'auth/invalid-reset-token',
      'O link de redefinição é inválido ou expirou.'
    );
  }

  const result = await users.updateOne(
    { id: user.id, ...validTokenQuery },
    {
      $set: {
        password_hash: bcrypt.hashSync(password, PASSWORD_SALT_ROUNDS),
        updated_at: now(),
      },
      $unset: {
        password_reset_token_hash: '',
        password_reset_expires_at: '',
        password_reset_requested_at: '',
      },
    }
  );

  if (result.modifiedCount !== 1) {
    throw new AppError(
      400,
      'auth/invalid-reset-token',
      'O link de redefinição é inválido ou expirou.'
    );
  }
}

export function getCurrentUser(user) {
  const publicUser = toPublicUser(user);

  return {
    user: publicUser,
    profile: publicUser,
  };
}
