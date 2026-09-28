
import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from '../services/authService.js';

const router = Router();

/*
 * Registrar usuário
 */
router.post('/register', async (req, res, next) => {
  try {
    const result = await registerUser(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
});

/*
 * Login
 */
router.post('/login', async (req, res, next) => {
  try {
    const result = await loginUser(req.body);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

/*
 * Usuário autenticado
 */
router.get('/me', authRequired, (req, res) => {
  res.json(getCurrentUser(req.authUser));
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

