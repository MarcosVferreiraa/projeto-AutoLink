import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Heart, Calculator, Edit, Trash2, Send, Calendar, Gauge, Fuel, Zap, Palette } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { useCars } from '../context/CarContext';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useProposals } from '../context/ProposalsContext';
import { db } from '../../firebase/firebase';
import { formatPhoneByThreeDigits } from '../utils/phone';
import './CarDetails.css';
import { ConfirmModal } from '../components/ConfirmModal';

export function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars, loading, removeCar } = useCars();
  const { user, userProfile, isAdmin } = useAuth() || {};
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
    let isMounted = true;

    const loadOwnerInfo = async () => {
      if (!car?.userId) {
        setOwnerInfo({
          name: 'Anunciante não identificado',
          phone: 'Não informado',
        });
        return;
      }

      setIsOwnerLoading(true);

      try {
        const userSnapshot = await getDoc(doc(db, 'users', car.userId));
        if (!isMounted) return;

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setOwnerInfo({
            name: userData?.name || userData?.displayName || 'Anunciante',
            phone: formatPhoneByThreeDigits(userData?.phone || userData?.phoneNumber || '') || 'Não informado',
          });
        } else {
          setOwnerInfo({
            name: 'Anunciante não encontrado',
            phone: 'Não informado',
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dados do anunciante:', error);
        if (!isMounted) return;
        setOwnerInfo({
          name: 'Anunciante indisponível',
          phone: 'Não informado',
        });
      } finally {
        if (isMounted) setIsOwnerLoading(false);
      }
    };

    loadOwnerInfo();

    return () => {
      isMounted = false;
    };
  }, [car?.userId]);

  if (loading) return <div className="car-details-container">Carregando...</div>;
  if (!car) return <div className="car-details-container">Veículo não encontrado.</div>;

  const canEdit = user && (isAdmin || car.userId === user?.uid);

  const handleSendProposal = async (event) => {
    event.preventDefault();

    if (!user) {
      alert('Faça login para enviar uma proposta.');
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
      alert('Proposta enviada para análise do administrador.');
    } catch (error) {
      console.error('Erro ao enviar proposta:', error);
      setProposalError('Não foi possível enviar a proposta agora. Tente novamente.');
    } finally {
      setIsSendingProposal(false);
    }
  };

  const openProposalModal = () => {
    if (!user) {
      alert('Faça login para enviar uma proposta.');
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
          <img src={car.image} alt={car.model} className="car-main-image" />
          <h1>{car.brand} {car.model}</h1>
          <div className="car-price-value">R$ {Number(car.price).toLocaleString('pt-BR')}</div>

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
              <label htmlFor="proposal-value">Valor da Proposta (R$)</label>
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