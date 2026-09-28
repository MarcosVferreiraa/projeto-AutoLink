import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch, getToken, jsonBody } from "../api";
import { useAuth } from "./AuthContext";
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
  const { user, loading } = useAuth();
  const { removeCarFromState } = useCars();

  useEffect(() => {
    if (loading) return;
    if (!getToken()) {
      setProposals([]);
      return;
    }

    apiFetch("/proposals")
      .then((result) => setProposals((result.proposals || []).map((proposal) => {
        const normalized = normalizeProposalDraft({
          ...proposal,
          price: proposal.price ?? proposal.value ?? 0,
          originalPrice: proposal.originalPrice ?? proposal.carPrice ?? proposal.price ?? proposal.value ?? 0,
          buyerEmail: proposal.buyerEmail || proposal.createdByEmail || proposal.email || "",
          status: proposal.status,
        });

        return {
          ...normalized,
          status: normalizeProposalStatus(normalized.status),
        };
      }).sort(sortProposalsForReview)))
      .catch((error) => console.error("Erro ao carregar propostas:", error));
  }, [loading, user]);

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
