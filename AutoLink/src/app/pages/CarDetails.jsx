import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Heart, Calculator, Edit, Trash2, Send, Calendar, Gauge, Fuel, Zap, Palette } from 'lucide-react';
import { useCars } from '../context/CarContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationsContext';
import { useFavorites } from '../context/FavoritesContext';
import { useProposals } from '../context/ProposalsContext';
import { formatCurrency } from '../utils/currency';
import { formatPhoneByThreeDigits } from '../utils/phone';
import './CarDetails.css';
import { ConfirmModal } from '../components/ConfirmModal';

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%236b7280' font-family='Arial,sans-serif' font-size='28'%3EImagem indisponivel%3C/text%3E%3C/svg%3E";

export function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars, loading, removeCar } = useCars();
  const { user, userProfile, isAdmin } = useAuth() || {};
  const { notify } = useNotifications();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addProposal } = useProposals();
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [proposalValue, setProposalValue] = useState('');
  const [proposalMessage, setProposalMessage] = useState('');
  const [proposalError, setProposalError] = useState('');
  const [isSendingProposal, setIsSendingProposal] = useState(false);
  const [ownerInfo, setOwnerInfo] = useState(null);
  const [isOwnerLoading, setIsOwnerLoading] = useState(false);

  const car = cars?.find(c => String(c.id) === String(id));

  useEffect(() => {
    const loadOwnerInfo = async () => {
      if (!car?.userId) {
        setOwnerInfo({
          name: 'Anunciante não identificado',
          phone: 'Não informado',
        });
        return;
      }

      setIsOwnerLoading(true);

      setOwnerInfo({
        name: car.createdByName || 'Anunciante não identificado',
        phone: formatPhoneByThreeDigits(car.createdByPhone || '') || 'Não informado',
      });
      setIsOwnerLoading(false);
    };

    loadOwnerInfo();

    return undefined;
  }, [car?.userId, car?.createdByName, car?.createdByPhone]);

  if (loading) return <div className="car-details-container">Carregando...</div>;
  if (!car) return <div className="car-details-container">Veículo não encontrado.</div>;

  const canEdit = user && (isAdmin || car.userId === user?.uid);
  const carFeatures = (Array.isArray(car.features)
    ? car.features
    : typeof car.features === 'string'
      ? car.features.split(',')
      : [])
    .filter((feature) => typeof feature === 'string')
    .map((feature) => feature.trim())
    .filter(Boolean);

  const handleSendProposal = async (event) => {
    event.preventDefault();

    if (!user) {
      notify('Entre na sua conta para enviar uma proposta.', 'info');
      return;
    }

    const proposedPrice = Number(proposalValue);
    if (Number.isNaN(proposedPrice) || proposedPrice <= 0) {
      setProposalError('Informe um valor válido para a proposta.');
      return;
    }

    try {
      setProposalError('');
      setIsSendingProposal(true);

      await addProposal({
        carId: String(car.id),
        carImage: car.image || '',
        carBrand: car.brand || 'Veículo',
        carModel: car.model || '',
        carYear: car.year || '',
        proposalType: 'cash',
        originalPrice: Number(car.price) || 0,
        price: proposedPrice,
        buyerId: user.uid || user.id,
        buyerEmail: user.email || userProfile?.email || 'email-nao-informado',
        message: proposalMessage || 'Proposta enviada via Car Details'
      });

      setIsProposalModalOpen(false);
      setProposalValue('');
      setProposalMessage('');
      notify('Proposta enviada para análise do administrador.', 'success');
    } catch (error) {
      console.error('Erro ao enviar proposta:', error);
      setProposalError('Não foi possível enviar a proposta agora. Tente novamente.');
    } finally {
      setIsSendingProposal(false);
    }
  };

  const openProposalModal = () => {
    if (!user) {
      notify('Entre na sua conta para enviar uma proposta.', 'info');
      return;
    }

    setProposalError('');
    setProposalValue(String(car.price || ''));
    setProposalMessage('');
    setIsProposalModalOpen(true);
  };

  return (
    <div className="car-details-container">
      <button className="btn-back" onClick={() => navigate(-1)}><ArrowLeft /> Voltar</button>

      <div className="car-details-layout">
        <div className="car-main-content">
          <img
            src={car.image || FALLBACK_IMAGE}
            alt={car.model}
            className="car-main-image"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
          <h1>{car.brand} {car.model}</h1>
          <div className="car-price-value">{formatCurrency(car.price)}</div>

          {/* Grade de Especificações */}
          <div className="specs-grid">
            <div className="spec-item"><Calendar size={20} /> <span>{car.year}</span></div>
            <div className="spec-item"><Gauge size={20} /> <span>{car.mileage} km</span></div>
            <div className="spec-item"><Fuel size={20} /> <span>{car.fuel}</span></div>
            <div className="spec-item"><Zap size={20} /> <span>{car.transmission}</span></div>
            <div className="spec-item"><Palette size={20} /> <span>{car.color}</span></div>
          </div>

          <div className="car-description-card">
            <h3>Descrição</h3>
            <p>{car.description}</p>
          </div>

          {carFeatures.length > 0 && (
            <section className="car-features-card">
              <h3>Equipamentos</h3>
              <ul className="car-features-list">
                {carFeatures.map((feature, index) => (
                  <li key={`${feature}-${index}`}>{feature}</li>
                ))}
              </ul>
            </section>
          )}

          <div className="owner-info-card">
            <h3>Informações do Anunciante</h3>
            {isOwnerLoading ? (
              <p>A carregar dados do anunciante...</p>
            ) : (
              <>
                <p><strong>Dono:</strong> {ownerInfo?.name || 'Não informado'}</p>
                <p><strong>Telefone:</strong> {ownerInfo?.phone || 'Não informado'}</p>
              </>
            )}
          </div>
        </div>

        <aside className="car-sidebar">
          <div className="sidebar-sticky-card">
            <h3>Negociação</h3>
            <button
              onClick={() => toggleFavorite(car.id)}
              className={`btn-action ${isFavorite(car.id) ? 'favorite-active' : ''}`}
            >
              <Heart size={18} />
              {isFavorite(car.id) ? 'Favoritado' : 'Favoritar'}
            </button>
            <button onClick={openProposalModal} className="btn-action">
              <Send size={18} /> Enviar Proposta
            </button>
            <Link to="/financiamento" state={{ car }} className="btn-action"><Calculator size={18} /> Simular Financiamento</Link>

            {canEdit && (
              <>
                <Link to={`/carro/${id}/editar`} className="btn-action"><Edit size={18} /> Editar Anúncio</Link>
                <button
  onClick={() => setIsDeleteModalOpen(true)}
  className="btn-action"
><Trash2 size={18} /> Remover Veículo</button>
              </>
            )}
          </div>
        </aside>
      </div>

      {isProposalModalOpen && (
        <div className="proposal-modal-overlay" onClick={() => setIsProposalModalOpen(false)}>
          <div className="proposal-modal" onClick={(event) => event.stopPropagation()}>
            <h3>Enviar Proposta</h3>
            <p className="proposal-modal-subtitle">
              {car.brand} {car.model} ({car.year})
            </p>

            <form onSubmit={handleSendProposal} className="proposal-modal-form">
              <label htmlFor="proposal-value">Valor da Proposta (€)</label>
              <input
                id="proposal-value"
                type="number"
                min="1"
                step="1"
                value={proposalValue}
                onChange={(event) => setProposalValue(event.target.value)}
                required
              />

              <label htmlFor="proposal-message">Mensagem (opcional)</label>
              <textarea
                id="proposal-message"
                rows={3}
                value={proposalMessage}
                onChange={(event) => setProposalMessage(event.target.value)}
                placeholder="Ex.: Tenho interesse e posso fechar ainda esta semana."
              />

              {proposalError && <p className="proposal-modal-error">{proposalError}</p>}

              <div className="proposal-modal-actions">
                <button
                  type="button"
                  className="proposal-btn proposal-btn-secondary"
                  onClick={() => setIsProposalModalOpen(false)}
                  disabled={isSendingProposal}
                >
                  Cancelar
                </button>
                <button type="submit" className="proposal-btn proposal-btn-primary" disabled={isSendingProposal}>
                  {isSendingProposal ? 'Enviando...' : 'Enviar ao Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ConfirmModal
  isOpen={isDeleteModalOpen}
  onClose={() => setIsDeleteModalOpen(false)}
  onConfirm={() => {
    removeCar(car.id);
    navigate('/');
  }}
  title="Excluir veículo"
  message="Esta ação não pode ser desfeita. Deseja continuar?"
/>
    </div>
  );
}