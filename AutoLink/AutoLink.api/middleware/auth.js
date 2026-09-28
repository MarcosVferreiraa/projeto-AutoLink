import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { users } from '../database.js';

export async function authRequired(req, res, next) {
  const authorizationHeader = req.headers.authorization || '';
  const token = authorizationHeader.startsWith('Bearer ')
    ? authorizationHeader.slice('Bearer '.length)
    : '';

  try {
    const decodedToken = jwt.verify(token, config.jwtSecret);
    req.authUser = await users.findOne({
      id: decodedToken.uid,
    });

    if (!req.authUser) {
      return res.status(401).json({
        message: 'Sessão inválida.',
        code: 'auth/session-invalid',
      });
    }

    return next();
  } catch {
    return res.status(401).json({
      message: 'Autenticação necessária.',
      code: 'auth/unauthorized',
    });
  }
}

export function adminRequired(req, res, next) {
  if (req.authUser?.role !== 'admin') {
    return res.status(403).json({
      message: 'Acesso de administrador necessário.',
      code: 'auth/forbidden',
    });
  }

  return next();
}

export function requireOwnerOrAdmin(req, ownerId) {
  const isAdmin = req.authUser?.role === 'admin';
  const isOwner = req.authUser?.id === ownerId;

  return isAdmin || isOwner;
}
