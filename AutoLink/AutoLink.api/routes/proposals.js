
import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import {
  createProposal,
  deleteProposal,
  listProposals,
  updateProposal,
} from '../services/proposalsService.js';

const router = Router();

router.use(authRequired);


router.get('/', async (req, res, next) => {
  try {
    res.json(await listProposals(req.authUser));
  } catch (error) {
    next(error);
  }
});


router.post('/', async (req, res, next) => {
  try {
    const result = await createProposal(
      req.authUser,
      req.body
    );
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});


router.patch('/:id', async (req, res, next) => {
  try {
    res.json(await updateProposal(req));
  } catch (error) {
    next(error);
  }
});


router.delete('/:id', async (req, res, next) => {
  try {
    await deleteProposal(req);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;

