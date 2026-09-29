
import { Router } from 'express';
import { cars } from '../database.js';
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
import { listCars } from '../services/carsService.js';

const router = Router();


router.get('/', async (req, res, next) => {
  try {
    const result = await listCars(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
});


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

