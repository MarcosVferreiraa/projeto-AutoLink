import { createContext, useContext, useState, useEffect } from "react";
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  addDoc 
} from "firebase/firestore";
import { db } from "../../firebase/firebase"; 

const ProposalsContext = createContext(undefined);

export const ProposalsProvider = ({ children }) => {
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "proposals"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const proposalsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProposals(proposalsData);
    });
    return () => unsubscribe();
  }, []);

  const addProposal = async (data) => {
    try {
      await addDoc(collection(db, "proposals"), {
        ...data,
        status: "pending",
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Erro ao enviar proposta:", error);
    }
  };

  const acceptProposal = async (id) => {
    await updateDoc(doc(db, "proposals", id), { status: "approved" });
  };

  const rejectProposal = async (id) => {
    await updateDoc(doc(db, "proposals", id), { status: "rejected" });
  };

  const cancelProposal = async (id) => {
    await deleteDoc(doc(db, "proposals", id));
  };

  const getUserProposals = (userId) => {
    return proposals.filter((p) => p.buyerId === userId);
  };

  return (
    <ProposalsContext.Provider value={{
      proposals,
      addProposal,
      acceptProposal,
      rejectProposal,
      cancelProposal,
      getUserProposals
    }}>
      {children}
    </ProposalsContext.Provider>
  );
};

export const useProposals = () => useContext(ProposalsContext);