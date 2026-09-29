
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

