
import bcrypt from 'bcryptjs';
import { Router } from 'express';

import { users } from '../database.js';
import { AppError } from '../errors.js';
import {
  adminRequired,
  authRequired,
} from '../middleware/auth.js';
import { toPublicUser } from '../utils.js';
import {
  validatePassword,
  validateUserUpdate,
} from '../validation.js';

const router = Router();

/*
 * Atualizar perfil
 */
router.patch('/me', authRequired, async (req, res, next) => {
  try {
    const payload = validateUserUpdate(req.body);

    await users.updateOne(
      { id: req.authUser.id },
      {
        $set: {
          name: payload.name || req.authUser.name,
          phone: payload.phone,
        },
      }
    );

    const user = await users.findOne({
      id: req.authUser.id,
    });

    res.json({
      profile: toPublicUser(user),
    });
  } catch (error) {
    next(error);
  }
});

/*
 * Alterar senha
 */
router.patch(
  '/me/password',
  authRequired,
  async (req, res, next) => {
    try {
      const currentPassword = String(
        req.body?.currentPassword || ''
      );

      const newPassword = validatePassword(
        req.body?.newPassword,
        6
      );

      const isPasswordCorrect = bcrypt.compareSync(
        currentPassword,
        req.authUser.password_hash
      );

      if (!isPasswordCorrect) {
        throw new AppError(
          401,
          'auth/wrong-password',
          'Senha atual incorreta.'
        );
      }

      const passwordHash = bcrypt.hashSync(
        newPassword,
        12
      );

      await users.updateOne(
        { id: req.authUser.id },
        {
          $set: {
            password_hash: passwordHash,
          },
        }
      );

      return res.status(204).end();
    } catch (error) {
      return next(error);
    }
  }
);

/*
 * Excluir própria conta
 */
router.delete('/me', authRequired, async (req, res, next) => {
  try {
    const password = String(
      req.headers['x-delete-password'] || ''
    );

    const isPasswordCorrect = bcrypt.compareSync(
      password,
      req.authUser.password_hash
    );

    if (!isPasswordCorrect) {
      throw new AppError(
        401,
        'auth/wrong-password',
        'Senha incorreta.'
      );
    }

    await users.deleteOne({
      id: req.authUser.id,
    });

    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
});

/*
 * Listar todos os usuários
 * Apenas administradores
 */
router.get(
  '/',
  authRequired,
  adminRequired,
  async (_req, res) => {
    const usersList = await users
      .find()
      .sort({ created_at: -1 })
      .toArray();

    res.json({
      users: usersList.map(toPublicUser),
    });
  }
);

/*
 * Alterar função do usuário
 * Apenas administradores
 */
router.patch(
  '/:id/role',
  authRequired,
  adminRequired,
  async (req, res, next) => {
    try {
      const role =
        req.body?.role === 'admin'
          ? 'admin'
          : 'user';

      await users.updateOne(
        { id: req.params.id },
        {
          $set: {
            role,
          },
        }
      );

      const user = await users.findOne({
        id: req.params.id,
      });

      res.json({
        user: toPublicUser(user),
      });
    } catch (error) {
      next(error);
    }
  }
);

/*
 * Excluir usuário
 * Apenas administradores
 */
router.delete(
  '/:id',
  authRequired,
  adminRequired,
  async (req, res, next) => {
    try {
      await users.deleteOne({
        id: req.params.id,
      });

      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
);

export default router;

