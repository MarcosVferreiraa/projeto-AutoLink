import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch, jsonBody } from "../api";
import { useCars } from "./CarContext";
import { getProposalOwnerId, normalizeProposalDraft, normalizeProposalStatus, sortProposalsForReview, validateProposalApproval } from "./proposalsDomain";

const ProposalsContext = createContext(undefined);
const proposalsContextFallback = {
  proposals: [],
  addProposal: async () => { throw new Error("ProposalsProvider não disponível."); },
  acceptProposal: async () => { throw new Error("ProposalsProvider não disponível."); },
  rejectProposal: async () => { throw new Error("ProposalsProvider não disponível."); },
  cancelProposal: async () => { throw new Error("ProposalsProvider não disponível."); },
  getUserProposals: () => [],
  canApproveProposal: () => ({ valid: false, reason: "ProposalsProvider não disponível." }),
};

export const ProposalsProvider = ({ children }) => {
  const [proposals, setProposals] = useState([]);
  const { removeCarFromState } = useCars();

  useEffect(() => {
    apiFetch("/proposals")
      .then((result) => setProposals((result.proposals || []).map((proposal) => ({ ...proposal, status: normalizeProposalStatus(proposal.status) })).sort(sortProposalsForReview)))
      .catch((error) => console.error("Erro ao carregar propostas:", error));
  }, []);

  const addProposal = async (data) => {
    const result = await apiFetch("/proposals", { method: "POST", body: jsonBody(normalizeProposalDraft(data)) });
    setProposals((previous) => [{ ...result.proposal, status: "pending" }, ...previous]);
  };

  const canApproveProposal = (proposal) => validateProposalApproval(proposal);
  const updateProposal = async (id, payload) => {
    const result = await apiFetch(`/proposals/${id}`, { method: "PATCH", body: jsonBody(payload) });
    setProposals((previous) => previous.map((proposal) => proposal.id === id ? result.proposal : proposal));
  };

  const acceptProposal = async (id, proposal) => {
    const validation = validateProposalApproval(proposal);
    if (!validation.valid) throw new Error(validation.reason);
    await updateProposal(id, { status: "approved", reviewedAt: new Date().toISOString() });
    if (proposal?.carId && proposal.carId !== "simulador") removeCarFromState(String(proposal.carId));
  };

  const rejectProposal = (id, reason = "") => updateProposal(id, { status: "rejected", rejectionReason: reason, reviewedAt: new Date().toISOString() });
  const cancelProposal = async (id) => {
    await apiFetch(`/proposals/${id}`, { method: "DELETE" });
    setProposals((previous) => previous.filter((proposal) => proposal.id !== id));
  };
  const getUserProposals = (userId) => userId ? proposals.filter((proposal) => getProposalOwnerId(proposal) === userId) : [];

  return <ProposalsContext.Provider value={{ proposals, addProposal, acceptProposal, rejectProposal, cancelProposal, getUserProposals, canApproveProposal }}>{children}</ProposalsContext.Provider>;
};

export const useProposals = () => useContext(ProposalsContext) || proposalsContextFallback;
