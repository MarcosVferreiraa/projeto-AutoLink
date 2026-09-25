
import express from 'express';
import cors from 'cors';

import { config } from './config.js';
import { connectDatabase, seedDevelopmentAdmin } from './database.js';

import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import carsRoutes from './routes/cars.js';
import favoritesRoutes from './routes/favorites.js';
import proposalsRoutes from './routes/proposals.js';

import { errorHandler } from './middleware/errorHandler.js';

const app = express();

/* =========================
   Middlewares
========================= */
app.use(cors({ origin: true }));
app.use(express.json({ limit: '1mb' }));

/* =========================
   Health Check
========================= */
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

/* =========================
   Rotas
========================= */
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/cars', carsRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/proposals', proposalsRoutes);

/* =========================
   Tratamento de Erros
========================= */
app.use(errorHandler);

/* =========================
   Inicialização
========================= */
async function startServer() {
  try {
    await connectDatabase();
    await seedDevelopmentAdmin();

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

startServer();

