
import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import {
  getCurrentUser,
  completePasswordReset,
  loginUser,
  requestPasswordReset,
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


router.post('/forgot-password', async (req, res, next) => {
  try {
    const result = await requestPasswordReset(req.body?.email);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

router.post('/reset-password', async (req, res, next) => {
  try {
    await completePasswordReset(req.body);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
});

export default router;

