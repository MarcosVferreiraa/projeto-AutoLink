import { Shield, Clock, CheckCircle, XCircle, Check, X, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router'; // Integrado com o react-router do teu app
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

  const getStatusBadge = (status) => {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* CABEÇALHO DO PAINEL */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Gerenciar Propostas</h1>
          </div>
          <p className="text-muted-foreground">
            Painel de controlo do administrador para análise e decisão de propostas recebidas.
          </p>
        </div>
        
        {/* BOTÃO PARA IR PARA A PÁGINA DE MEMBROS/USUÁRIOS */}
        <Link
          to="/admin/usuarios"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground hover:opacity-90 rounded-md font-medium transition-all shadow-sm text-sm"
        >
          <Users className="w-4 h-4" />
          Gerenciar Usuários
        </Link>
      </div>

      {proposals && proposals.length > 0 ? (
        <div className="space-y-6">
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="bg-card rounded-lg border border-border overflow-hidden shadow-sm"
            >
              <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-semibold text-lg">
                      Proposta #{proposal.id}
                    </span>
                    {getStatusBadge(proposal.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Cliente: <span className="text-foreground font-medium">{proposal.userName}</span> ({proposal.userEmail})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Telefone: <span className="text-foreground font-medium">{proposal.userPhone}</span>
                  </p>
                  {proposal.message && (
                    <div className="mt-3 p-3 bg-muted rounded-md text-sm italic text-muted-foreground">
                      "{proposal.message}"
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                    Veículo Solicitado
                  </span>
                  <span className="font-medium block text-base">
                    {proposal.carBrand} {proposal.carModel}
                  </span>
                  <span className="text-sm text-muted-foreground block">
                    Ano: {proposal.carYear}
                  </span>
                </div>

                <div className="space-y-1 md:text-right">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                    Valor Oferecido
                  </span>
                  <span className="text-2xl font-bold text-primary block">
                    R$ {Number(proposal.price).toLocaleString('pt-BR')}
                  </span>
                  <span className="text-xs text-muted-foreground block">
                    Preço de tabela: R$ {Number(proposal.originalPrice).toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>

              <div className="bg-muted px-6 py-3 flex justify-between items-center flex-wrap gap-3 border-t border-border">
                <Link
                  to={`/carro/${proposal.carId}`}
                  className="px-4 py-2 border border-border bg-card rounded-md hover:bg-background transition-colors text-sm"
                >
                  Ver Carro
                </Link>
                {proposal.status === 'pending' && (
                  <div className="flex gap-3">
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
                  </div>
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