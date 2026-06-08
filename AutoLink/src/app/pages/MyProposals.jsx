import React from 'react';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
const mockProposals = [{
  id: 1,
  car: 'Mercedes-Benz C200',
  year: 2021,
  proposedPrice: 180000,
  status: 'pending',
  date: '2026-05-28',
  image: 'https://images.unsplash.com/photo-1618642624018-a370cbf3cd80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
}];
export function MyProposals() {
  const getStatusBadge = status => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"><Clock className="w-4 h-4" />Aguardando</span>;
      case 'approved':
        return <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"><CheckCircle className="w-4 h-4" />Aprovada</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"><XCircle className="w-4 h-4" />Recusada</span>;
      default:
        return null;
    }
  };
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div className="mb-8"><div className="flex items-center gap-3 mb-2"><FileText className="w-8 h-8 text-primary" /><h1>Minhas Propostas</h1></div><p className="text-muted-foreground">Acompanhe o status das suas propostas de compra</p></div>{mockProposals.length > 0 ? <div className="space-y-4">{mockProposals.map(proposal => <div key={proposal.id} className="bg-card rounded-lg border border-border overflow-hidden"><div className="p-6"><div className="flex items-start gap-6"><img src={proposal.image} alt={proposal.car} className="w-32 h-24 object-cover rounded-lg" /><div className="flex-1"><div className="flex items-start justify-between mb-4"><div><h3 className="mb-1">{proposal.car}</h3><p className="text-muted-foreground">{proposal.year}</p></div>{getStatusBadge(proposal.status)}</div><div className="grid grid-cols-2 gap-4"><div><p className="text-sm text-muted-foreground">Valor Proposto</p><p className="text-primary">R$ {proposal.proposedPrice.toLocaleString('pt-BR')}</p></div><div><p className="text-sm text-muted-foreground">Data da Proposta</p><p>{new Date(proposal.date).toLocaleDateString('pt-BR')}</p></div></div></div></div></div><div className="bg-muted px-6 py-3 flex gap-3"><button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity text-sm">Ver Detalhes</button><button className="px-4 py-2 border border-border rounded-md hover:bg-card transition-colors text-sm">Cancelar Proposta</button></div></div>)}</div> : <div className="text-center py-16 bg-card rounded-lg border border-border"><FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" /><h3 className="mb-2">Nenhuma proposta enviada</h3><p className="text-muted-foreground mb-6">Faça uma proposta em um dos nossos veículos disponíveis</p><a href="/" className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">Ver Estoque</a></div>}</div>;
}