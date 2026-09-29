
import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from '../services/authService.js';

const router = Router();


router.post('/register', async (req, res, next) => {
  try {
    const result = await registerUser(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
});


router.post('/login', async (req, res, next) => {
  try {
    const result = await loginUser(req.body);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});


router.get('/me', authRequired, (req, res) => {
  res.json(getCurrentUser(req.authUser));
});


router.post('/logout', (_req, res) => {
  res.status(204).end();
});


router.post('/forgot-password', (_req, res) => {
  res.json({
    message:
      'Se o e-mail existir, as instruções serão enviadas.',
  });
});

export default router;

