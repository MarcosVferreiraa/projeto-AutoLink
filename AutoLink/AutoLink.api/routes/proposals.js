
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

/*
 * Listar propostas
 *
 * Administradores podem visualizar todas.
 * Usuários comuns visualizam apenas as próprias.
 */
router.get('/', async (req, res, next) => {
  try {
    res.json(await listProposals(req.authUser));
  } catch (error) {
    next(error);
  }
});

/*
 * Criar proposta
 */
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

/*
 * Atualizar proposta
 */
router.patch('/:id', async (req, res, next) => {
  try {
    res.json(await updateProposal(req));
  } catch (error) {
    next(error);
  }
});

/*
 * Excluir proposta
 */
router.delete('/:id', async (req, res, next) => {
  try {
    await deleteProposal(req);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;

