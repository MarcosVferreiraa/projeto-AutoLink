import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useProposals } from "../context/ProposalsContext";
import "./AdminProposals.css";

export function AdminProposals() {
  const { user, isAdmin } = useAuth();
  const { proposals, acceptProposal, rejectProposal, cancelProposal, canApproveProposal } = useProposals();
  const navigate = useNavigate();
  const [processingId, setProcessingId] = useState("");
  const [isDeletingPending, setIsDeletingPending] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => { 
    if (user !== undefined && (!user || !isAdmin)) navigate('/'); 
  }, [user, isAdmin, navigate]);

  const stats = useMemo(() => {
    const total = proposals?.length || 0;
    const pending = proposals?.filter((p) => (p.status || "").toLowerCase() === "pending").length || 0;
    const approved = proposals?.filter((p) => (p.status || "").toLowerCase() === "approved").length || 0;
    const rejected = proposals?.filter((p) => (p.status || "").toLowerCase() === "rejected").length || 0;
    return { total, pending, approved, rejected };
  }, [proposals]);

  const filteredProposals = useMemo(() => {
    return (proposals || []).filter((proposal) => {
      const normalizedStatus = (proposal.status || "").toLowerCase().trim();
      const normalizedType = proposal.proposalType === "financing" ? "financing" : "cash";

      const statusOk = statusFilter === "all" || normalizedStatus === statusFilter;
      const typeOk = typeFilter === "all" || normalizedType === typeFilter;

      return statusOk && typeOk;
    });
  }, [proposals, statusFilter, typeFilter]);

  const formatCurrency = (value) => `R$ ${Number(value || 0).toLocaleString('pt-BR')}`;

  const handleApprove = async (proposal) => {
    const validation = canApproveProposal(proposal);
    if (!validation.valid) {
      alert(validation.reason);
      return;
    }

    try {
      setProcessingId(proposal.id);
      await acceptProposal(proposal.id, proposal);
    } catch (error) {
      alert(error?.message || 'Não foi possível aprovar a proposta.');
    } finally {
      setProcessingId("");
    }
  };

  const handleReject = async (proposal) => {
    try {
      setProcessingId(proposal.id);
      await rejectProposal(proposal.id, 'Recusada pela administração.');
    } catch {
      alert('Não foi possível recusar a proposta.');
    } finally {
      setProcessingId("");
    }
  };

  const handleDeleteAllPending = async () => {
    const pending = (proposals || []).filter(
      (p) => (p.status || "").toLowerCase() === "pending"
    );

    if (pending.length === 0) {
      alert('Não há propostas pendentes para apagar.');
      return;
    }

    const confirmed = window.confirm(
      `Apagar ${pending.length} proposta(s) pendente(s)? Esta ação não pode ser desfeita.`
    );
    if (!confirmed) return;

    try {
      setIsDeletingPending(true);
      await Promise.all(pending.map((p) => cancelProposal(p.id)));
    } catch {
      alert('Erro ao apagar algumas propostas. Tente novamente.');
    } finally {
      setIsDeletingPending(false);
    }
  };

  return (
    <div className="admin-prop-container">
      <header className="admin-prop-header">
        <h1>Gestão de Propostas</h1>
        <div className="admin-prop-header-actions">
          {stats.pending > 0 && (
            <button
              className="prop-btn-delete-pending"
              onClick={handleDeleteAllPending}
              disabled={isDeletingPending}
            >
              {isDeletingPending
                ? 'A apagar...'
                : `Apagar pendentes (${stats.pending})`}
            </button>
          )}
          <Link to="/admin/usuarios" className="prop-btn-manage-users">Gerir Utilizadores</Link>
        </div>
      </header>

      <div className="prop-stats">
        <div className="prop-stat-item"><strong>{stats.total}</strong><span>Total</span></div>
        <div className="prop-stat-item"><strong>{stats.pending}</strong><span>Pendentes</span></div>
        <div className="prop-stat-item"><strong>{stats.approved}</strong><span>Aprovadas</span></div>
        <div className="prop-stat-item"><strong>{stats.rejected}</strong><span>Recusadas</span></div>
      </div>

      <div className="prop-filters">
        <div className="prop-filter-field">
          <label htmlFor="status-filter">Filtrar por status</label>
          <select id="status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">Todos</option>
            <option value="pending">Pendentes</option>
            <option value="approved">Aprovadas</option>
            <option value="rejected">Recusadas</option>
          </select>
        </div>

        <div className="prop-filter-field">
          <label htmlFor="type-filter">Filtrar por tipo</label>
          <select id="type-filter" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
            <option value="all">Todos</option>
            <option value="cash">À vista</option>
            <option value="financing">Financiamento</option>
          </select>
        </div>

        <div className="prop-filter-count">
          <strong>{filteredProposals.length}</strong>
          <span>resultado(s)</span>
        </div>
      </div>

      <div className="prop-grid">
        {filteredProposals.map((proposal) => {
          const statusNormalizado = (proposal.status || "").toLowerCase().trim();
          const isFinancing = proposal.proposalType === "financing";
          const validation = canApproveProposal(proposal);
          const isProcessing = processingId === proposal.id;
          const createdAt = proposal.createdAt ? new Date(proposal.createdAt).toLocaleString('pt-PT') : 'Sem data';
          
          return (
            <div key={proposal.id} className="prop-card">
              <img src={proposal.carImage} className="prop-image" alt="Carro" />
              <div className="prop-details">
                <h3>{proposal.carBrand} {proposal.carModel}</h3>
                <p>Comprador: {proposal.buyerEmail}</p>
                <p>Data: {createdAt}</p>
                <p>Tipo: <strong>{isFinancing ? 'Financiamento' : 'Proposta à vista'}</strong></p>
                <p>Status: <span className={`prop-status prop-status-${statusNormalizado || 'unknown'}`}>{proposal.status || 'indefinido'}</span></p>

                <div className="prop-financials">
                  <p>Preço do Veículo: <strong>{formatCurrency(proposal.originalPrice)}</strong></p>
                  <p>{isFinancing ? 'Valor a Financiar' : 'Valor Proposto'}: <strong>{formatCurrency(proposal.price)}</strong></p>
                  {isFinancing && (
                    <>
                      <p>Entrada: <strong>{formatCurrency(proposal.financing?.downPayment)}</strong></p>
                      <p>Prazo: <strong>{proposal.financing?.months || 0} meses</strong></p>
                      <p>Parcela: <strong>{formatCurrency(proposal.financing?.monthlyPayment)}</strong></p>
                    </>
                  )}
                </div>

                {statusNormalizado === "pending" && !validation.valid && (
                  <p className="prop-warning">{validation.reason}</p>
                )}
                
                {statusNormalizado === "pending" && (
                  <div className="prop-actions">
                    <button 
                      onClick={() => handleApprove(proposal)} 
                      className="prop-btn-accept"
                      disabled={!validation.valid || isProcessing}
                    >
                      {isFinancing ? 'Aprovar Financiamento' : 'Aprovar Proposta'}
                    </button>
                    <button 
                      onClick={() => handleReject(proposal)} 
                      className="prop-btn-reject"
                      disabled={isProcessing}
                    >
                      Recusar
                    </button>
                  </div>
                )}

                {statusNormalizado !== "pending" && (
                  <p className="prop-reviewed">Revisada em: {proposal.reviewedAt ? new Date(proposal.reviewedAt).toLocaleString('pt-PT') : 'N/A'}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredProposals.length === 0 && (
        <p className="prop-empty">Nenhuma proposta encontrada para os filtros selecionados.</p>
      )}
    </div>
  );
}