
import { Router } from 'express';
import { cars, proposals } from '../database.js';
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
import { validateProposalPayload } from '../validation.js';

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
    const query =
      req.authUser.role === 'admin'
        ? {}
        : {
            'payload.userId': req.authUser.id,
          };

    const proposalsList = await proposals
      .find(query)
      .sort({ created_at: -1 })
      .toArray();

    res.json({
      proposals: proposalsList.map(readPayload),
    });
  } catch (error) {
    next(error);
  }
});

/*
 * Criar proposta
 */
router.post('/', async (req, res, next) => {
  try {
    const payload = validateProposalPayload(req.body);
    const proposalId = createId();

    const proposal = {
      ...payload,
      userId: req.authUser.id,
      ownerId: req.authUser.id,
    };

    const status = 'pending';

    await proposals.insertOne({
      id: proposalId,
      payload: proposal,
      status,
      created_at: now(),
    });

    res.status(201).json({
      proposal: {
        id: proposalId,
        ...proposal,
        status,
      },
    });
  } catch (error) {
    next(error);
  }
});

/*
 * Atualizar proposta
 */
router.patch('/:id', async (req, res, next) => {
  try {
    const proposalId = req.params.id;

    const existingProposal = await proposals.findOne({
      id: proposalId,
    });

    if (!existingProposal) {
      throw new AppError(
        404,
        'proposals/not-found',
        'Proposta não encontrada.'
      );
    }

    const ownerId =
      existingProposal.payload?.userId ||
      existingProposal.payload?.ownerId ||
      req.authUser.id;

    const isAllowed = requireOwnerOrAdmin(
      req,
      ownerId
    );

    if (!isAllowed) {
      throw new AppError(
        403,
        'proposals/forbidden',
        'Você não pode alterar esta proposta.'
      );
    }

    const currentPayload =
      existingProposal.payload || {};

    const updatedPayload = {
      ...currentPayload,
      ...validateProposalPayload({
        ...currentPayload,
        ...(req.body || {}),
      }),
    };

    const status =
      updatedPayload.status ||
      existingProposal.status;

    await proposals.updateOne(
      { id: proposalId },
      {
        $set: {
          payload: updatedPayload,
          status,
        },
      }
    );

    /*
     * Se a proposta for aprovada,
     * remove o carro do estoque.
     */
    const shouldRemoveCar =
      status === 'approved' &&
      updatedPayload.carId &&
      updatedPayload.carId !== 'simulador';

    if (shouldRemoveCar) {
      await cars.deleteOne({
        id: String(updatedPayload.carId),
      });
    }

    res.json({
      proposal: {
        id: proposalId,
        ...updatedPayload,
        status,
      },
    });
  } catch (error) {
    next(error);
  }
});

/*
 * Excluir proposta
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const proposalId = req.params.id;

    const existingProposal = await proposals.findOne({
      id: proposalId,
    });

    if (!existingProposal) {
      throw new AppError(
        404,
        'proposals/not-found',
        'Proposta não encontrada.'
      );
    }

    const ownerId =
      existingProposal.payload?.userId ||
      existingProposal.payload?.ownerId ||
      req.authUser.id;

    const isAllowed = requireOwnerOrAdmin(
      req,
      ownerId
    );

    if (!isAllowed) {
      throw new AppError(
        403,
        'proposals/forbidden',
        'Você não pode excluir esta proposta.'
      );
    }

    await proposals.deleteOne({
      id: proposalId,
    });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;

