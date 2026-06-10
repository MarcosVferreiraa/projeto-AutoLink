import { Shield, Clock, CheckCircle, XCircle, Check, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProposals } from '../context/ProposalsContext';

export function AdminProposals() {
  const { user, isAdmin } = useAuth();
  const { proposals, acceptProposal, rejectProposal } = useProposals();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/');
    }
  }, [user, isAdmin, navigate]);

  if (!user || !isAdmin) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
            <Clock className="w-3 h-3" />
            Aguardando
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            <CheckCircle className="w-3 h-3" />
            Aprovada
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
            <XCircle className="w-3 h-3" />
            Recusada
          </span>
        );
      default:
        return null;
    }
  };

  const pendingCount = proposals.filter(p => p.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-primary" />
          <h1>Painel de Administração — Propostas</h1>
        </div>
        <p className="text-muted-foreground">
          {proposals.length} {proposals.length === 1 ? 'proposta' : 'propostas'} no total
          {pendingCount > 0 && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">
              {pendingCount} aguardando
            </span>
          )}
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <Clock className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
          <p className="text-2xl mb-1">{proposals.filter(p => p.status === 'pending').length}</p>
          <p className="text-sm text-muted-foreground">Aguardando</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-500" />
          <p className="text-2xl mb-1">{proposals.filter(p => p.status === 'approved').length}</p>
          <p className="text-sm text-muted-foreground">Aprovadas</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <XCircle className="w-6 h-6 mx-auto mb-2 text-destructive" />
          <p className="text-2xl mb-1">{proposals.filter(p => p.status === 'rejected').length}</p>
          <p className="text-sm text-muted-foreground">Recusadas</p>
        </div>
      </div>

      {proposals.length > 0 ? (
        <div className="space-y-4">
          {proposals.map(proposal => (
            <div key={proposal.id} className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="p-6">
                <div className="flex items-start gap-6">
                  <img
                    src={proposal.carImage}
                    alt={`${proposal.carBrand} ${proposal.carModel}`}
                    className="w-28 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3 gap-3">
                      <div>
                        <h3 className="mb-0.5">{proposal.carBrand} {proposal.carModel} {proposal.carYear}</h3>
                        <p className="text-sm text-muted-foreground">
                          Cliente: <span className="text-foreground">{proposal.userName}</span>
                        </p>
                      </div>
                      {getStatusBadge(proposal.status)}
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Preço Anunciado</p>
                        <p className="text-sm">R$ {proposal.carPrice.toLocaleString('pt-BR')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Valor Proposto</p>
                        <p className="text-sm text-primary">R$ {proposal.proposedPrice.toLocaleString('pt-BR')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Data</p>
                        <p className="text-sm">{new Date(proposal.date).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    {proposal.message && (
                      <p className="text-sm text-muted-foreground italic">"{proposal.message}"</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-muted px-6 py-3 flex items-center gap-3">
                <Link
                  to={`/carro/${proposal.carId}`}
                  className="px-4 py-2 border border-border bg-card rounded-md hover:bg-background transition-colors text-sm"
                >
                  Ver Carro
                </Link>
                {proposal.status === 'pending' && (
                  <>
                    <button
                      onClick={() => acceptProposal(proposal.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Aceitar
                    </button>
                    <button
                      onClick={() => rejectProposal(proposal.id)}
                      className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:opacity-90 transition-opacity text-sm flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Recusar
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-lg border border-border">
          <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="mb-2">Nenhuma proposta recebida</h3>
          <p className="text-muted-foreground">
            As propostas dos clientes aparecerão aqui
          </p>
        </div>
      )}
    </div>
  );
}
