
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
};

if (
  isProduction &&
  (!config.jwtSecret || !config.mongoUri)
) {
  throw new Error(
    'JWT_SECRET e MONGODB_URI são obrigatórios em produção.'
  );
}

