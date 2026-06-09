import { FileText, Clock, CheckCircle, XCircle, LogIn } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useProposals } from '../context/ProposalsContext';

export function MyProposals() {
  const { user } = useAuth();
  const { getUserProposals, cancelProposal } = useProposals();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
            <Clock className="w-4 h-4" />
            Aguardando
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            <CheckCircle className="w-4 h-4" />
            Aprovada
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
            <XCircle className="w-4 h-4" />
            Recusada
          </span>
        );
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16 bg-card rounded-lg border border-border">
          <LogIn className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="mb-2">Faça login para ver suas propostas</h3>
          <p className="text-muted-foreground mb-6">
            Você precisa estar logado para acessar esta página
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Voltar para o Início
          </Link>
        </div>
      </div>
    );
  }

  const proposals = getUserProposals(user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-8 h-8 text-primary" />
          <h1>Minhas Propostas</h1>
        </div>
        <p className="text-muted-foreground">
          Acompanhe o status das suas propostas de compra
        </p>
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
                    className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-4 gap-3">
                      <div>
                        <h3 className="mb-1">{proposal.carBrand} {proposal.carModel}</h3>
                        <p className="text-muted-foreground">{proposal.carYear}</p>
                      </div>
                      {getStatusBadge(proposal.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Preço Anunciado</p>
                        <p>R$ {proposal.carPrice.toLocaleString('pt-BR')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Valor Proposto</p>
                        <p className="text-primary">R$ {proposal.proposedPrice.toLocaleString('pt-BR')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Data da Proposta</p>
                        <p>{new Date(proposal.date).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    {proposal.message && (
                      <p className="text-sm text-muted-foreground italic">"{proposal.message}"</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-muted px-6 py-3 flex gap-3">
                <Link
                  to={`/carro/${proposal.carId}`}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity text-sm"
                >
                  Ver Carro
                </Link>
                {proposal.status === 'pending' && (
                  <button
                    onClick={() => cancelProposal(proposal.id)}
                    className="px-4 py-2 border border-destructive text-destructive rounded-md hover:bg-destructive/10 transition-colors text-sm"
                  >
                    Cancelar Proposta
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-lg border border-border">
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="mb-2">Nenhuma proposta enviada</h3>
          <p className="text-muted-foreground mb-6">
            Faça uma proposta em um dos nossos veículos disponíveis
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Ver Estoque
          </Link>
        </div>
      )}
    </div>
  );
}
