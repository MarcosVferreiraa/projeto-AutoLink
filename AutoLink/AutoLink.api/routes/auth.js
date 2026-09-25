
import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { users } from '../database.js';
import { AppError } from '../errors.js';
import { authRequired } from '../middleware/auth.js';
import {
  createId,
  createToken,
  toPublicUser,
} from '../utils.js';
import {
  validateLogin,
  validateUserRegistration,
} from '../validation.js';

const router = Router();

/*
 * Registrar usuário
 */
router.post('/register', async (req, res, next) => {
  try {
    const input = validateUserRegistration(req.body);

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

    const userDoc = {
      id: createId(),
      name: input.name,
      email: input.email,
      password_hash: bcrypt.hashSync(
        input.password,
        12
      ),
      phone: input.phone,
      birth_date: input.birthDate,
      role: 'user',
      approved: false,
      created_at: new Date().toISOString(),
    };

    await users.insertOne(userDoc);

    const savedUser = await users.findOne({
      id: userDoc.id,
    });

    const publicUser = toPublicUser(savedUser);
    const token = createToken(savedUser);

    return res.status(201).json({
      token,
      user: publicUser,
      profile: publicUser,
    });
  } catch (error) {
    return next(error);
  }
});

/*
 * Login
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = validateLogin(
      req.body
    );

    const user = await users.findOne({
      email,
    });

    const isPasswordValid =
      user &&
      bcrypt.compareSync(
        password,
        user.password_hash
      );

    if (!isPasswordValid) {
      throw new AppError(
        401,
        'auth/invalid-credential',
        'E-mail ou senha incorretos.'
      );
    }

    const publicUser = toPublicUser(user);
    const token = createToken(user);

    return res.json({
      token,
      user: publicUser,
      profile: publicUser,
    });
  } catch (error) {
    return next(error);
  }
});

/*
 * Usuário autenticado
 */
router.get('/me', authRequired, (req, res) => {
  const publicUser = toPublicUser(
    req.authUser
  );

  res.json({
    user: publicUser,
    profile: publicUser,
  });
});

/*
 * Logout
 *
 * Como o JWT é stateless, o logout é tratado
 * pelo cliente removendo o token.
 */
router.post('/logout', (_req, res) => {
  res.status(204).end();
});

/*
 * Recuperação de senha
 */
router.post('/forgot-password', (_req, res) => {
  res.json({
    message:
      'Se o e-mail existir, as instruções serão enviadas.',
  });
});

export default router;

