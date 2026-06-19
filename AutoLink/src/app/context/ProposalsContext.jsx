import { createContext, useContext, useState, useEffect } from "react";
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  addDoc,
  writeBatch
} from "firebase/firestore";
import { db } from "../../firebase/firebase"; 
import { useCars } from "./CarContext";
import {
  getProposalOwnerId,
  normalizeProposalDraft,
  normalizeProposalStatus,
  sortProposalsForReview,
  validateProposalApproval,
} from "./proposalsDomain";

const ProposalsContext = createContext(undefined);

const proposalsContextFallback = {
  proposals: [],
  addProposal: async () => {
    throw new Error("ProposalsProvider não disponível.");
  },
  acceptProposal: async () => {
    throw new Error("ProposalsProvider não disponível.");
  },
  rejectProposal: async () => {
    throw new Error("ProposalsProvider não disponível.");
  },
  cancelProposal: async () => {
    throw new Error("ProposalsProvider não disponível.");
  },
  getUserProposals: () => [],
  canApproveProposal: () => ({ valid: false, reason: "ProposalsProvider não disponível." })
};

export const ProposalsProvider = ({ children }) => {
  const [proposals, setProposals] = useState([]);
  const { removeCarFromState } = useCars();

  useEffect(() => {
    const q = query(collection(db, "proposals"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const proposalsData = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          status: normalizeProposalStatus(doc.data()?.status)
        }))
        .sort(sortProposalsForReview);

      setProposals(proposalsData);
    });
    return () => unsubscribe();
  }, []);

  const addProposal = async (data) => {
    try {
      await addDoc(collection(db, "proposals"), normalizeProposalDraft(data));
    } catch (error) {
      console.error("Erro ao enviar proposta:", error);
      throw error;
    }
  };

  const canApproveProposal = (proposal) => validateProposalApproval(proposal);

  const acceptProposal = async (id, proposal) => {
    const validation = validateProposalApproval(proposal);
    if (!validation.valid) {
      throw new Error(validation.reason);
    }

    const soldCarId = String(proposal?.carId || "").trim();

    if (soldCarId && soldCarId !== "simulador") {
      const batch = writeBatch(db);
      batch.update(doc(db, "proposals", id), {
        status: "approved",
        reviewedAt: new Date().toISOString()
      });
      batch.delete(doc(db, "cars", soldCarId));
      await batch.commit();
      removeCarFromState(soldCarId);
      return;
    }

    await updateDoc(doc(db, "proposals", id), {
      status: "approved",
      reviewedAt: new Date().toISOString()
    });
  };

  const rejectProposal = async (id, reason = "") => {
    await updateDoc(doc(db, "proposals", id), {
      status: "rejected",
      rejectionReason: reason,
      reviewedAt: new Date().toISOString()
    });
  };

  const cancelProposal = async (id) => {
    await deleteDoc(doc(db, "proposals", id));
  };

  const getUserProposals = (userId) => {
    if (!userId) return [];

    return proposals.filter((p) => {
      return getProposalOwnerId(p) === userId;
    });
  };

  return (
    <ProposalsContext.Provider value={{
      proposals,
      addProposal,
      acceptProposal,
      rejectProposal,
      cancelProposal,
      getUserProposals,
      canApproveProposal
    }}>
      {children}
    </ProposalsContext.Provider>
  );
};

export const useProposals = () => {
  const context = useContext(ProposalsContext);
  return context || proposalsContextFallback;
};