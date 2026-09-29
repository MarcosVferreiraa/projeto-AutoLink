
import dotenv from 'dotenv';

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const apiDirectory = path.dirname(
  fileURLToPath(import.meta.url)
);

dotenv.config({
  path: path.join(apiDirectory, '.env'),
});

const nodeEnv =
  process.env.NODE_ENV || 'development';

const isProduction =
  nodeEnv === 'production';

const jwtSecret =
  process.env.JWT_SECRET ||
  (!isProduction
    ? 'autolink-development-secret'
    : undefined);

export const config = {
  nodeEnv,

  port: Number(
    process.env.API_PORT || 3001
  ),

  jwtSecret,

  mongoUri:
    process.env.MONGODB_URI || '',

  mongoDatabase:
    process.env.MONGODB_DATABASE ||
    'autolink',

  appUrl: (process.env.APP_URL || 'http://localhost:5173')
    .replace(/\/+$/, ''),

  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    from: process.env.SMTP_FROM || process.env.SMTP_USER || '',
  },
};

if (
  isProduction &&
  (!config.jwtSecret || !config.mongoUri)
) {
  throw new Error(
    'JWT_SECRET e MONGODB_URI são obrigatórios em produção.'
  );
}

