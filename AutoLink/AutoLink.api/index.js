import express from 'express';
import cors from 'cors';

import { config } from './config.js';
import {
  connectDatabase,
  seedDevelopmentAdmin,
} from './database.js';

import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import carsRoutes from './routes/cars.js';
import favoritesRoutes from './routes/favorites.js';
import proposalsRoutes from './routes/proposals.js';

import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: true }));
app.use(express.json({ limit: '1mb' }));

let databasePromise;

async function ensureDatabase() {
  if (!databasePromise) {
    databasePromise = connectDatabase()
      .then(() => seedDevelopmentAdmin())
      .catch((error) => {
        databasePromise = null;
        throw error;
      });
  }

  await databasePromise;
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use(async (req, res, next) => {
  try {
    await ensureDatabase();
    next();
  } catch (error) {
    console.error(
      'Erro ao inicializar o banco de dados:',
      error
    );

    next(error);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/cars', carsRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/proposals', proposalsRoutes);

app.use(errorHandler);

async function startServer() {
  try {
    await ensureDatabase();

    app.listen(config.port, () => {
      console.log(
        `🚗 API AutoLink disponível em http://localhost:${config.port}`
      );
    });
  } catch (error) {
    console.error(
      'Não foi possível conectar ao MongoDB:',
      error.message
    );

    process.exitCode = 1;
  }
}

if (process.env.NODE_ENV !== 'production') {
  startServer();
}

export default app;