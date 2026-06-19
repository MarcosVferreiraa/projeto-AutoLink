import { Calculator } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProposals } from '../context/ProposalsContext';
import './FinanceSimulator.css';

const SIMULATION_PLACEHOLDER_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'><rect width='640' height='360' fill='%23f3f4f6'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%236b7280' font-size='24' font-family='Arial,sans-serif'>Simulacao de Compra</text></svg>";

export function FinanceSimulator() {
  const location = useLocation();
  const selectedCar = location.state?.car;
  const { user, userProfile, isAdmin } = useAuth();
  const { addProposal, proposals } = useProposals();

  const [carPrice, setCarPrice] = useState('150000');
  const [downPayment, setDownPayment] = useState('30000');
  const [months, setMonths] = useState('48');
  const [interestRate] = useState(1.5);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [proposalMessage, setProposalMessage] = useState('');
  const [proposalError, setProposalError] = useState('');
  const [isSendingProposal, setIsSendingProposal] = useState(false);
  const [adminStatusFilter, setAdminStatusFilter] = useState('all');
  const [adminTypeFilter, setAdminTypeFilter] = useState('all');

  useEffect(() => {
    if (!selectedCar?.price) return;
    setCarPrice(String(selectedCar.price));
  }, [selectedCar]);

  const calculateMonthlyPayment = () => {
    const price = Number(carPrice);
    const down = Number(downPayment);
    const term = Number(months);
    const rate = interestRate / 100;
    const financed = price - down;
    const payment = financed > 0 
      ? (financed * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1) 
      : 0;

    return {
      monthlyPayment: payment > 0 ? payment : 0,
      totalAmount: payment > 0 ? (payment * term + down) : price,
      totalInterest: payment > 0 ? ((payment * term + down) - price) : 0,
      financedAmount: financed > 0 ? financed : 0
    };
  };

  const result = calculateMonthlyPayment();

  const formatCurrency = (value) => {
    return Number(value || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const adminFinanceData = useMemo(() => {
    const allAdminProposals = proposals || [];

    const financingCount = allAdminProposals.filter((proposal) => proposal?.proposalType === 'financing').length;
    const cashCount = allAdminProposals.filter((proposal) => proposal?.proposalType !== 'financing').length;

    const typeScopedProposals = adminTypeFilter === 'all'
      ? allAdminProposals
      : allAdminProposals.filter((proposal) => {
          const normalizedType = proposal?.proposalType === 'financing' ? 'financing' : 'cash';
          return normalizedType === adminTypeFilter;
        });

    const pendingCount = typeScopedProposals.filter((proposal) => proposal?.status === 'pending').length;
    const approvedCount = typeScopedProposals.filter((proposal) => proposal?.status === 'approved').length;
    const rejectedCount = typeScopedProposals.filter((proposal) => proposal?.status === 'rejected').length;

    const sortedProposals = [...typeScopedProposals].sort((a, b) => {
      const dateA = Date.parse(a?.createdAt || 0) || 0;
      const dateB = Date.parse(b?.createdAt || 0) || 0;
      return dateB - dateA;
    });

    const filteredProposals = adminStatusFilter === 'all'
      ? sortedProposals
      : sortedProposals.filter((proposal) => proposal?.status === adminStatusFilter);

    const filteredTotalRequested = filteredProposals.reduce(
      (sum, proposal) => sum + Number(proposal?.price || 0),
      0
    );

    const filteredTotalFinanced = filteredProposals.reduce(
      (sum, proposal) => sum + Number(proposal?.financing?.financedAmount || 0),
      0
    );

    const filteredFinancingProposals = filteredProposals.filter((proposal) => proposal?.proposalType === 'financing');

    const filteredAverageDownPayment = filteredFinancingProposals.length
      ? filteredFinancingProposals.reduce(
          (sum, proposal) => sum + Number(proposal?.financing?.downPayment || 0),
          0
        ) / filteredFinancingProposals.length
      : 0;

    const recentProposals = filteredProposals.slice(0, 6);

    return {
      totalProposals: allAdminProposals.length,
      financingCount,
      cashCount,
      typeScopedCount: typeScopedProposals.length,
      pendingCount,
      approvedCount,
      rejectedCount,
      filteredProposals,
      filteredTotalRequested,
      filteredTotalFinanced,
      filteredAverageDownPayment,
      recentProposals
    };
  }, [adminStatusFilter, adminTypeFilter, proposals]);

  if (isAdmin) {
    return (
      <div className="simulator-container">
        <div className="simulator-header">
          <div className="simulator-title-row">
            <Calculator className="w-8 h-8 text-primary" />
            <h1>Painel de Propostas (Admin)</h1>
          </div>
          <p>Visão consolidada das propostas de financiamento e à vista.</p>
        </div>

        <div className="admin-finance-grid">
          <div className="admin-finance-metric simulator-card">
            <p className="admin-finance-metric-label">Propostas (Filtro)</p>
            <p className="admin-finance-metric-subtext">Total geral: {adminFinanceData.totalProposals}</p>
            <p className="admin-finance-metric-value">{adminFinanceData.typeScopedCount}</p>
          </div>
          <div className="admin-finance-metric simulator-card">
            <p className="admin-finance-metric-label">Tipos</p>
            <p className="admin-finance-metric-value">{adminFinanceData.financingCount}</p>
            <p className="admin-finance-metric-subtext">À vista: {adminFinanceData.cashCount}</p>
          </div>
          <div className="admin-finance-metric simulator-card">
            <p className="admin-finance-metric-label">Pendentes</p>
            <p className="admin-finance-metric-value">{adminFinanceData.pendingCount}</p>
          </div>
          <div className="admin-finance-metric simulator-card">
            <p className="admin-finance-metric-label">Aprovadas / Recusadas</p>
            <p className="admin-finance-metric-value">{adminFinanceData.approvedCount}</p>
            <p className="admin-finance-metric-subtext">Recusadas: {adminFinanceData.rejectedCount}</p>
          </div>
        </div>

        <div className="simulator-layout">
          <div className="simulator-card admin-finance-section">
            <h3>Indicadores do Filtro Atual</h3>
            <div className="breakdown-list">
              <div className="breakdown-row"><span className="label-text">Total Proposto</span><strong>{formatCurrency(adminFinanceData.filteredTotalRequested)}</strong></div>
              <div className="breakdown-row"><span className="label-text">Valor Financiado (apenas financiamento)</span><strong>{formatCurrency(adminFinanceData.filteredTotalFinanced)}</strong></div>
              <div className="breakdown-row total-row"><span className="label-text">Entrada Média (apenas financiamento)</span><strong>{formatCurrency(adminFinanceData.filteredAverageDownPayment)}</strong></div>
            </div>
          </div>

          <div className="simulator-card admin-finance-section">
            <h3>Atalhos Administrativos</h3>
            <div className="simulator-results-column">
              <Link to="/admin/propostas" className="btn-request-finance">
                Ir para Gerenciar Propostas
              </Link>
              <Link to="/admin/usuarios" className="btn-request-finance">
                Ir para Gerenciar Usuários
              </Link>
            </div>
          </div>
        </div>

        <div className="simulator-card admin-finance-section">
          <h3>Propostas Recentes</h3>
          <div className="admin-finance-filters">
            <button
              type="button"
              className={`admin-finance-filter-btn ${adminTypeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setAdminTypeFilter('all')}
            >
              Todos os tipos
            </button>
            <button
              type="button"
              className={`admin-finance-filter-btn ${adminTypeFilter === 'financing' ? 'active' : ''}`}
              onClick={() => setAdminTypeFilter('financing')}
            >
              Financiamento ({adminFinanceData.financingCount})
            </button>
            <button
              type="button"
              className={`admin-finance-filter-btn ${adminTypeFilter === 'cash' ? 'active' : ''}`}
              onClick={() => setAdminTypeFilter('cash')}
            >
              À vista ({adminFinanceData.cashCount})
            </button>
          </div>

          <div className="admin-finance-filters">
            <button
              type="button"
              className={`admin-finance-filter-btn ${adminStatusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setAdminStatusFilter('all')}
            >
              Todas
            </button>
            <button
              type="button"
              className={`admin-finance-filter-btn ${adminStatusFilter === 'pending' ? 'active' : ''}`}
              onClick={() => setAdminStatusFilter('pending')}
            >
              Pendentes ({adminFinanceData.pendingCount})
            </button>
            <button
              type="button"
              className={`admin-finance-filter-btn ${adminStatusFilter === 'approved' ? 'active' : ''}`}
              onClick={() => setAdminStatusFilter('approved')}
            >
              Aprovadas ({adminFinanceData.approvedCount})
            </button>
            <button
              type="button"
              className={`admin-finance-filter-btn ${adminStatusFilter === 'rejected' ? 'active' : ''}`}
              onClick={() => setAdminStatusFilter('rejected')}
            >
              Recusadas ({adminFinanceData.rejectedCount})
            </button>
          </div>

          {adminFinanceData.recentProposals.length > 0 ? (
            <div className="admin-finance-list">
              {adminFinanceData.recentProposals.map((proposal) => (
                <div key={proposal.id} className="admin-finance-item">
                  <div className="admin-finance-item-head">
                    <strong>{proposal.carBrand} {proposal.carModel} {proposal.carYear ? `(${proposal.carYear})` : ''}</strong>
                    <span className={`admin-finance-status status-${proposal.status || 'pending'}`}>
                      {proposal.status || 'pending'}
                    </span>
                  </div>
                  <div className="admin-finance-item-meta">
                    <span>Tipo: {proposal.proposalType === 'financing' ? 'Financiamento' : 'À vista'}</span>
                    <span>Proposta: {formatCurrency(proposal.price)}</span>
                    <span>Entrada: {proposal.proposalType === 'financing' ? formatCurrency(proposal.financing?.downPayment) : '-'}</span>
                    <span>Prazo: {proposal.proposalType === 'financing' ? `${proposal.financing?.months || 0} meses` : '-'}</span>
                    <span>Parcela: {proposal.proposalType === 'financing' ? formatCurrency(proposal.financing?.monthlyPayment) : '-'}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Sem propostas registradas para os filtros selecionados.</p>
          )}
        </div>
      </div>
    );
  }

  const handleSendProposal = async (event) => {
    event.preventDefault();

    if (isAdmin) {
      setProposalError('Admin não pode enviar proposta como cliente.');
      return;
    }

    if (!user) {
      setProposalError('Faça login para enviar uma proposta ao administrador.');
      return;
    }

    const proposedPrice = Number(carPrice) - Number(downPayment || 0);
    if (proposedPrice <= 0) {
      setProposalError('A proposta precisa ter um valor válido.');
      return;
    }

    try {
      setProposalError('');
      setIsSendingProposal(true);

      await addProposal({
        carId: selectedCar ? String(selectedCar.id) : 'simulador',
        carImage: selectedCar?.image || SIMULATION_PLACEHOLDER_IMAGE,
        carBrand: selectedCar?.brand || 'Veículo da Simulação',
        carModel: selectedCar?.model || 'Sem modelo definido',
        carYear: selectedCar?.year || '',
        proposalType: 'financing',
        originalPrice: Number(carPrice) || 0,
        price: proposedPrice,
        financing: {
          downPayment: Number(downPayment || 0),
          months: Number(months || 0),
          interestRate: Number(interestRate || 0),
          monthlyPayment: Number(result.monthlyPayment || 0),
          financedAmount: Number(result.financedAmount || 0),
          totalInterest: Number(result.totalInterest || 0),
          totalAmount: Number(result.totalAmount || 0)
        },
        buyerId: user.uid || user.id,
        buyerEmail: user.email || userProfile?.email || 'email-nao-informado',
        message: proposalMessage || `Proposta via simulador: entrada de R$ ${Number(downPayment || 0).toLocaleString('pt-BR')} em ${months}x.`
      });

      setIsProposalModalOpen(false);
      setProposalMessage('');
      alert('Proposta enviada para análise do administrador.');
    } catch (error) {
      console.error('Erro ao enviar proposta:', error);
      setProposalError('Não foi possível enviar a proposta agora. Tente novamente.');
    } finally {
      setIsSendingProposal(false);
    }
  };

  const openProposalModal = () => {
    setProposalError('');
    setProposalMessage('');
    setIsProposalModalOpen(true);
  };

  return (
    <div className="simulator-container">
      <div className="simulator-header">
        <div className="simulator-title-row">
          <Calculator className="w-8 h-8 text-primary" />
          <h1>Simulador de Financiamento</h1>
        </div>
        <p>Calcule o valor aproximado das parcelas para o seu próximo veículo</p>
      </div>

      <div className="simulator-layout">
        {/* COLUNA ESQUERDA: INPUTS */}
        <div className="simulator-card">
          <div className="form-group">
            <label>Valor do Veículo (R$)</label>
            <input type="number" value={carPrice} onChange={(e) => setCarPrice(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Valor de Entrada (R$)</label>
            <input type="number" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Prazo de Pagamento</label>
            <select value={months} onChange={(e) => setMonths(e.target.value)}>
              <option value="12">12 meses</option>
              <option value="24">24 meses</option>
              <option value="36">36 meses</option>
              <option value="48">48 meses</option>
              <option value="60">60 meses</option>
            </select>
          </div>
          <div className="interest-rate-info">
            Taxa de juros: <strong>{interestRate}% ao mês</strong>.
          </div>
        </div>

        {/* COLUNA DIREITA: RESULTADOS */}
        <div className="simulator-results-column">
          <div className="simulator-card results-display-card">
            <p className="payment-label">Parcela Mensal Estimada</p>
            <h2 className="payment-value">R$ {result.monthlyPayment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
            <p className="payment-term">em {months}x fixas</p>
          </div>

          <div className="simulator-card details-breakdown-card">
            <h3>Resumo da Simulação</h3>
            <div className="breakdown-list">
              <div className="breakdown-row"><span className="label-text">Preço do Carro</span><span>R$ {Number(carPrice).toLocaleString('pt-BR')}</span></div>
              <div className="breakdown-row"><span className="label-text">Entrada</span><span>R$ {Number(downPayment).toLocaleString('pt-BR')}</span></div>
              <div className="breakdown-row"><span className="label-text">Valor Financiado</span><span>R$ {result.financedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
              <div className="breakdown-row"><span className="label-text">Total de Juros</span><span>R$ {result.totalInterest.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
              <div className="breakdown-row total-row"><span className="label-text">Total a Pagar</span><span className="value-text">R$ {result.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
            </div>
          </div>

          <button className="btn-request-finance" onClick={openProposalModal}>Enviar Proposta ao Admin</button>
        </div>
      </div>

      {isProposalModalOpen && (
        <div className="finance-proposal-modal-overlay" onClick={() => setIsProposalModalOpen(false)}>
          <div className="finance-proposal-modal" onClick={(event) => event.stopPropagation()}>
            <h3>Enviar Proposta ao Admin</h3>
            <p className="finance-proposal-subtitle">
              {selectedCar ? `${selectedCar.brand} ${selectedCar.model} (${selectedCar.year})` : 'Proposta com base na sua simulação atual'}
            </p>

            <form onSubmit={handleSendProposal} className="finance-proposal-form">
              <div className="finance-summary-box">
                <div><span>Preço:</span><strong>R$ {Number(carPrice).toLocaleString('pt-BR')}</strong></div>
                <div><span>Entrada:</span><strong>R$ {Number(downPayment).toLocaleString('pt-BR')}</strong></div>
                <div><span>Proposta:</span><strong>R$ {(Number(carPrice) - Number(downPayment || 0)).toLocaleString('pt-BR')}</strong></div>
                <div><span>Prazo:</span><strong>{months} meses</strong></div>
              </div>

              <label htmlFor="finance-proposal-message">Mensagem (opcional)</label>
              <textarea
                id="finance-proposal-message"
                rows={3}
                value={proposalMessage}
                onChange={(event) => setProposalMessage(event.target.value)}
                placeholder="Ex.: Tenho interesse em fechar com estas condições."
              />

              {proposalError && <p className="finance-proposal-error">{proposalError}</p>}

              <div className="finance-proposal-actions">
                <button
                  type="button"
                  className="finance-proposal-btn finance-proposal-btn-secondary"
                  onClick={() => setIsProposalModalOpen(false)}
                  disabled={isSendingProposal}
                >
                  Cancelar
                </button>
                <button type="submit" className="finance-proposal-btn finance-proposal-btn-primary" disabled={isSendingProposal}>
                  {isSendingProposal ? 'Enviando...' : 'Confirmar Envio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}