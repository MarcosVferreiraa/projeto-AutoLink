import { Shield, Clock, CheckCircle, XCircle, Check, X, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useProposals } from "../context/ProposalsContext";
import "./AdminProposals.css";

export function AdminProposals() {
  const { user, isAdmin } = useAuth();
  const { proposals, acceptProposal, rejectProposal } = useProposals();
  const navigate = useNavigate();

  useEffect(() => {
    if (user !== undefined && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, isAdmin, navigate]);

  return (
    <div className="admin-proposals-container">
      <header className="admin-proposals-header">
        <h1>Gestão de Propostas</h1>
        <Link to="/admin/usuarios" className="users-link">
          <Users size={18} /> Gerir Utilizadores
        </Link>
      </header>

      {proposals && proposals.length > 0 ? (
        <div className="proposals-grid">
          {proposals.map((proposal) => {
            const status = proposal.status?.toLowerCase() || "";
            return (
              <div key={proposal.id} className="proposal-card">
                <div className="proposal-image">
                  <img src={proposal.carImage} alt={proposal.carModel} />
                </div>
                
                <div className="proposal-details">
                  <h3>{proposal.carBrand} {proposal.carModel}</h3>
                  <p><strong>Comprador:</strong> {proposal.buyerEmail}</p>
                  
                  <div className="status-box">
                    {status === "pending" && <span className="status-badge pending"><Clock size={16}/> Pendente</span>}
                    {status === "approved" && <span className="status-badge approved"><CheckCircle size={16}/> Aceite</span>}
                    {status === "rejected" && <span className="status-badge rejected"><XCircle size={16}/> Recusado</span>}
                  </div>

                  {status === "pending" && (
                    <div className="action-buttons-wrapper">
                      <button onClick={() => acceptProposal(proposal.id)} className="btn-action-custom btn-accept">
                        <Check size={16}/> Aceitar
                      </button>
                      <button onClick={() => rejectProposal(proposal.id)} className="btn-action-custom btn-reject">
                        <X size={16}/> Recusar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <h3>Nenhuma proposta recebida</h3>
        </div>
      )}
    </div>
  );
}