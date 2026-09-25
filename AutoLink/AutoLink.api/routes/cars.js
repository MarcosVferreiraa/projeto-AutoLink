
import { Router } from 'express';
import { cars, users } from '../database.js';
import { AppError } from '../errors.js';
import {
  authRequired,
  requireOwnerOrAdmin,
} from '../middleware/auth.js';
import {
  createId,
  now,
  readPayload,
} from '../utils.js';
import { validateCarPayload } from '../validation.js';

const router = Router();

/*
 * Listar carros
 */
router.get('/', async (_req, res) => {
  const carRows = await cars
    .find()
    .sort({ created_at: -1 })
    .toArray();

  const carList = await Promise.all(
    carRows.map(async (car) => {
      const user = await users.findOne({
        id: car.created_by,
      });

      return {
        ...readPayload(car),
        userId: car.created_by,
        createdByName: user?.name || '',
        createdByEmail: user?.email || '',
      };
    })
  );

  res.json({
    cars: carList,
  });
});

/*
 * Criar carro
 */
router.post('/', authRequired, async (req, res, next) => {
  try {
    const payload = validateCarPayload(req.body);
    const carId = createId();

    await cars.insertOne({
      id: carId,
      payload,
      created_by: req.authUser.id,
      created_at: now(),
    });

    res.status(201).json({
      car: {
        id: carId,
        ...payload,
        userId: req.authUser.id,
        createdByName: req.authUser.name,
        createdByEmail: req.authUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
});

/*
 * Atualizar carro
 */
router.patch('/:id', authRequired, async (req, res, next) => {
  try {
    const carId = req.params.id;

    const existingCar = await cars.findOne({
      id: carId,
    });

    if (!existingCar) {
      throw new AppError(
        404,
        'cars/not-found',
        'Carro não encontrado.'
      );
    }

    const isAllowed = requireOwnerOrAdmin(
      req,
      existingCar.created_by
    );

    if (!isAllowed) {
      throw new AppError(
        403,
        'cars/forbidden',
        'Você não pode alterar este carro.'
      );
    }

    const currentPayload =
      existingCar.payload || {};

    const updatedPayload = validateCarPayload({
      ...currentPayload,
      ...(req.body || {}),
    });

    await cars.updateOne(
      { id: carId },
      {
        $set: {
          payload: updatedPayload,
        },
      }
    );

    const updatedCar = await cars.findOne({
      id: carId,
    });

    res.json({
      car: {
        ...readPayload(updatedCar),
        ...updatedPayload,
      },
    });
  } catch (error) {
    next(error);
  }
});

/*
 * Excluir carro
 */
router.delete('/:id', authRequired, async (req, res, next) => {
  try {
    const carId = req.params.id;

    const existingCar = await cars.findOne({
      id: carId,
    });

    if (!existingCar) {
      throw new AppError(
        404,
        'cars/not-found',
        'Carro não encontrado.'
      );
    }

    const isAllowed = requireOwnerOrAdmin(
      req,
      existingCar.created_by
    );

    if (!isAllowed) {
      throw new AppError(
        403,
        'cars/forbidden',
        'Você não pode excluir este carro.'
      );
    }

    await cars.deleteOne({
      id: carId,
    });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;

