import { cars, proposals } from '../database.js';
import { AppError } from '../errors.js';
import { requireOwnerOrAdmin } from '../middleware/auth.js';
import {
  createId,
  now,
  readPayload,
} from '../utils.js';
import { validateProposalPayload } from '../validation.js';

function getProposalOwnerId(proposal, fallbackUserId) {
  return (
    proposal.payload?.userId ||
    proposal.payload?.ownerId ||
    fallbackUserId
  );
}

function ensureProposalOwner(req, proposal, action) {
  const ownerId = getProposalOwnerId(
    proposal,
    req.authUser.id
  );
  const isAllowed = requireOwnerOrAdmin(req, ownerId);

  if (!isAllowed) {
    throw new AppError(
      403,
      'proposals/forbidden',
      `Você não pode ${action} esta proposta.`
    );
  }
}

export async function listProposals(user) {
  const query =
    user.role === 'admin'
      ? {}
      : {
          'payload.userId': user.id,
        };
  const proposalDocuments = await proposals
    .find(query)
    .sort({ created_at: -1 })
    .toArray();

  return {
    proposals: proposalDocuments.map(readPayload),
  };
}

export async function createProposal(user, body) {
  const payload = validateProposalPayload(body);
  const proposalId = createId();
  const proposal = {
    ...payload,
    userId: user.id,
    ownerId: user.id,
    buyerId: user.id,
    buyerEmail: user.email,
  };
  const status = 'pending';

  await proposals.insertOne({
    id: proposalId,
    payload: proposal,
    status,
    created_at: now(),
  });

  return {
    proposal: {
      id: proposalId,
      ...proposal,
      status,
    },
  };
}

export async function updateProposal(req) {
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

  ensureProposalOwner(req, existingProposal, 'alterar');

  const currentPayload = existingProposal.payload || {};
  const updatedPayload = {
    ...currentPayload,
    ...validateProposalPayload({
      ...currentPayload,
      ...(req.body || {}),
    }),
  };
  const status =
    updatedPayload.status || existingProposal.status;

  await proposals.updateOne(
    { id: proposalId },
    {
      $set: {
        payload: updatedPayload,
        status,
      },
    }
  );

  const shouldRemoveCar =
    status === 'approved' &&
    updatedPayload.carId &&
    updatedPayload.carId !== 'simulador';

  if (shouldRemoveCar) {
    await cars.deleteOne({
      id: String(updatedPayload.carId),
    });
  }

  return {
    proposal: {
      id: proposalId,
      ...updatedPayload,
      status,
    },
  };
}

export async function deleteProposal(req) {
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

  ensureProposalOwner(req, existingProposal, 'excluir');
  await proposals.deleteOne({ id: proposalId });
}
