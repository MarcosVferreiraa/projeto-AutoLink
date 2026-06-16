import { createContext, useContext, useState, ReactNode } from 'react';

export interface Proposal {
  id: number;
  carId: number;
  carBrand: string;
  carModel: string;
  carYear: number;
  carImage: string;
  carPrice: number;
  userId: string;
  userName: string;
  proposedPrice: number;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

interface ProposalsContextType {
  proposals: Proposal[];
  addProposal: (data: Omit<Proposal, 'id' | 'date' | 'status'>) => void;
  cancelProposal: (id: number) => void;
  acceptProposal: (id: number) => void;
  rejectProposal: (id: number) => void;
  getUserProposals: (userId: string) => Proposal[];
  hasProposalForCar: (carId: number, userId: string) => boolean;
}

const ProposalsContext = createContext<ProposalsContextType | undefined>(undefined);

export const ProposalsProvider = ({ children }: { children: ReactNode }) => {
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: 1,
      carId: 1,
      carBrand: 'Mercedes-Benz',
      carModel: 'C200',
      carYear: 2021,
      carImage: 'https://images.unsplash.com/photo-1618642624018-a370cbf3cd80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      carPrice: 185000,
      userId:"demo-user",
      userName: 'João Silva',
      proposedPrice: 175000,
      message: 'Tenho interesse no veículo. Posso pagar à vista.',
      status: 'pending',
      date: '2026-06-01'
    },
    {
      id: 2,
      carId: 4,
      carBrand: 'Toyota',
      carModel: 'Corolla',
      carYear: 2021,
      carImage: 'https://images.unsplash.com/photo-1574023240744-64c47c8c0676?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      carPrice: 125000,
      userId: "demo-user",
      userName: 'João Silva',
      proposedPrice: 118000,
      message: 'Gostei muito do carro, podemos negociar?',
      status: 'approved',
      date: '2026-05-20'
    }
  ]);
  const [nextId, setNextId] = useState(3);

  const addProposal = (data: Omit<Proposal, 'id' | 'date' | 'status'>) => {
    setProposals(prev => [{
      ...data,
      id: nextId,
      status: 'pending' as const,
      date: new Date().toISOString().split('T')[0]
    }, ...prev]);
    setNextId(prev => prev + 1);
  };

  const cancelProposal = (id: number) => {
    setProposals(prev => prev.filter(p => p.id !== id));
  };

  const acceptProposal = (id: number) => {
    setProposals(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' as const } : p));
  };

  const rejectProposal = (id: number) => {
    setProposals(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' as const } : p));
  };

  const getUserProposals = (userId: string) => proposals.filter(p => p.userId === userId);

  const hasProposalForCar = (carId: number, userId: string) =>
    proposals.some(p => p.carId === carId && p.userId === userId && p.status === 'pending');

  return (
    <ProposalsContext.Provider value={{ proposals, addProposal, cancelProposal, acceptProposal, rejectProposal, getUserProposals, hasProposalForCar }}>
      {children}
    </ProposalsContext.Provider>
  );
}

export const useProposals = () => {
  const context = useContext(ProposalsContext);
  if (!context) throw new Error('useProposals must be used within ProposalsProvider');
  return context;
}
