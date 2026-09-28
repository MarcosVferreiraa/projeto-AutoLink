
import { Router } from 'express';

import {
  adminRequired,
  authRequired,
} from '../middleware/auth.js';
import {
  changeOwnPassword,
  deleteOwnAccount,
  deleteUser,
  listUsers,
  updateOwnProfile,
  updateUserRole,
} from '../services/usersService.js';

const router = Router();

/*
 * Atualizar perfil
 */
router.patch('/me', authRequired, async (req, res, next) => {
  try {
    const result = await updateOwnProfile(
      req.authUser,
      req.body
    );
    res.json(result);
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
      await changeOwnPassword(
        req.authUser,
        req.body
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
    await deleteOwnAccount(
      req.authUser,
      req.headers['x-delete-password']
    );

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
  async (_req, res, next) => {
    try {
      res.json(await listUsers());
    } catch (error) {
      next(error);
    }
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
      const result = await updateUserRole(
        req.params.id,
        req.body?.role
      );
      res.json(result);
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
      await deleteUser(req.params.id);

      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
);

export default router;

