
import { Router } from 'express';

import { favorites } from '../database.js';
import { authRequired } from '../middleware/auth.js';
import { createId, now } from '../utils.js';

const router = Router();

router.use(authRequired);

/*
 * Listar favoritos do usuário
 */
router.get('/', async (req, res) => {
  const userId = req.authUser.id;

  const favoriteRows = await favorites
    .find(
      { user_id: userId },
      {
        projection: {
          _id: 0,
          id: 1,
          car_id: 1,
        },
      }
    )
    .toArray();

  const favoriteList = favoriteRows.map(
    ({ id, car_id: carId }) => ({
      id,
      carId,
    })
  );

  res.json({
    favorites: favoriteList,
  });
});

/*
 * Adicionar carro aos favoritos
 */
router.post('/:carId', async (req, res) => {
  const userId = req.authUser.id;
  const carId = req.params.carId;

  await favorites.updateOne(
    {
      user_id: userId,
      car_id: carId,
    },
    {
      $setOnInsert: {
        id: createId(),
        user_id: userId,
        car_id: carId,
        created_at: now(),
      },
    },
    {
      upsert: true,
    }
  );

  const savedFavorite = await favorites.findOne({
    user_id: userId,
    car_id: carId,
  });

  const favorite = {
    id: savedFavorite.id,
    carId: savedFavorite.car_id,
  };

  res.status(201).json({
    favorite,
  });
});

/*
 * Remover carro dos favoritos
 */
router.delete('/:carId', async (req, res) => {
  const userId = req.authUser.id;
  const carId = req.params.carId;

  await favorites.deleteOne({
    user_id: userId,
    car_id: carId,
  });

  res.status(204).end();
});

export default router;

