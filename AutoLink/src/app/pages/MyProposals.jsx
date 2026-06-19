import { FileText, Clock, CheckCircle, XCircle, LogIn } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useProposals } from '../context/ProposalsContext';
import './MyProposals.css';
export function MyProposals() {
  const { user } = useAuth();
  const proposalsContext = useProposals();
  const getUserProposals = proposalsContext?.getUserProposals || (() => []);
  const cancelProposal = proposalsContext?.cancelProposal || (async () => {});

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="badge-status pending">
            <Clock className="w-4 h-4" />
            Aguardando
          </span>
        );
      case 'approved':
        return (
          <span className="badge-status approved">
            <CheckCircle className="w-4 h-4" />
            Aprovada
          </span>
        );
      case 'rejected':
        return (
          <span className="badge-status rejected">
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
      <div className="proposals-container proposals-login-state">
        <p>Faça login para ver as suas propostas.</p>
        <Link to="/login" className="btn-login-redirect">
          <LogIn className="w-4 h-4" />
          Fazer Login
        </Link>
      </div>
    );
  }

  const myProposals = getUserProposals(user.uid || user.id);

  return (
    <div className="proposals-container">
      <div className="proposals-header">
        <div className="proposals-title-row">
          <FileText className="w-8 h-8 text-primary" />
          <h1>Minhas Propostas</h1>
        </div>
        <p>Acompanhe o estado das propostas enviadas aos vendedores</p>
      </div>

      {myProposals.length > 0 ? (
        <div className="proposals-list">
          {myProposals.map((proposal) => (
            <div key={proposal.id} className="proposal-card">
              <div className="proposal-card-body">
                <img
                  src={proposal.carImage}
                  alt={`${proposal.carBrand} ${proposal.carModel}`}
                  className="proposal-car-thumb"
                />

                <div className="proposal-main-details">
                  <div className="proposal-details-header">
                    <h3>
                      {proposal.carBrand} {proposal.carModel}{proposal.carYear ? ` (${proposal.carYear})` : ''}
                    </h3>
                    {getStatusBadge(proposal.status)}
                  </div>

                  <div className="proposals-prices-row">
                    <div className="price-item">
                      <span className="label-text">Preço do Veículo</span>
                      <span className="value-text">
                        R$ {proposal.originalPrice ? proposal.originalPrice.toLocaleString('pt-BR') : 'N/A'}
                      </span>
                    </div>
                    <div className="price-item">
                      <span className="label-text">Sua Proposta</span>
                      <span className="value-text proposed">
                        R$ {proposal.price.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  {proposal.message && (
                    <div className="proposal-message-box">
                      <div className="label-text">Sua mensagem:</div>
                      <p>"{proposal.message}"</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="proposal-card-footer">
                <Link to={`/carro/${proposal.carId}`} className="btn-view-car">
                  Ver Carro
                </Link>
                {proposal.status === 'pending' && (
                  <button
                    onClick={() => cancelProposal(proposal.id)}
                    className="btn-cancel-proposal"
                  >
                    Cancelar Proposta
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="proposals-empty-state">
          <FileText className="proposals-empty-icon" />
          <h3>Nenhuma proposta enviada</h3>
          <p className="text-muted-foreground">
            Faça uma proposta em um dos nossos veículos disponíveis
          </p>
          <Link to="/" className="btn-go-stock">
            Ver Estoque
          </Link>
        </div>
      )}
    </div>
  );
}