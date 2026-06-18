import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Gauge, Fuel, Heart, Calculator, Edit, Trash2, Send } from 'lucide-react';
import { useCars } from '../context/CarContext';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { db } from "../../firebase/firebase"; 
import { collection, addDoc } from 'firebase/firestore';
import './CarDetails.css';

export function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars, loading, removeCar } = useCars();
  
  // CORREÇÃO: Adicionado isAdmin na desestruturação
  const { user, isAdmin } = useAuth() || {};
  
  const { isFavorite, toggleFavorite } = useFavorites();
  const car = cars?.find(c => String(c.id) === String(id));

  // Verificação de segurança para evitar erro ao carregar
  if (loading) return <div className="car-details-container">Carregando...</div>;
  if (!car) return <div className="car-details-container">Veículo não encontrado.</div>;

  // CORREÇÃO: Agora isAdmin está definido e canEdit funcionará
  const canEdit = user && (isAdmin || car.userId === user?.uid);

  // Função para enviar proposta ao Firestore
  const handleSendProposal = async () => {
    if (!user) return navigate('/login');
    
    try {
      await addDoc(collection(db, 'proposals'), {
        carId: car.id,
        carModel: car.model,
        carBrand: car.brand,
        carImage: car.image,      
        price: car.price,         
        buyerId: user.uid,
        buyerEmail: user.email,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      alert('Proposta enviada com sucesso!');
    } catch (error) {
      console.error("Erro ao enviar:", error);
      alert('Erro ao enviar proposta. Verifique se não está a usar um AdBlocker.');
    }
  };

  return (
    <main className="car-details-container">
      <Link to="/" className="btn-back"><ArrowLeft size={18} /> Voltar</Link>
      
      <div className="car-header">
        <h1>{car.brand} {car.model}</h1>
        <p className="car-price">R$ {Number(car.price || 0).toLocaleString('pt-BR')}</p>
      </div>

      <div className="car-content">
        <div className="car-image">
          <img src={car.image} alt={car.model} />
        </div>

        <aside className="car-sidebar">
          <div className="sidebar-sticky-card">
            <h3>Negociação</h3>
            
            <button 
              onClick={() => toggleFavorite(car.id)} 
              className={`btn-action ${isFavorite(car.id) ? 'active' : ''}`}
            >
              <Heart size={18} /> {isFavorite(car.id) ? 'Favoritado' : 'Favoritar'}
            </button>
            
            <Link to="/financiamento" className="btn-action">
              <Calculator size={18} /> Simular Financiamento
            </Link>

            {/* BOTÃO PROPOSTA (Visível apenas se NÃO for o dono/admin) */}
            {!canEdit && user && (
              <button onClick={handleSendProposal} className="btn-action btn-proposal">
                <Send size={18} /> Enviar Proposta
              </button>
            )}

            {/* BOTÕES ADMIN */}
            {canEdit && (
              <>
                <Link to={`/carro/${id}/editar`} className="btn-action btn-admin-edit">
                  <Edit size={18} /> Editar Anúncio
                </Link>
                <button onClick={() => removeCar(car.id)} className="btn-action btn-admin-delete">
                  <Trash2 size={18} /> Remover Veículo
                </button>
              </>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}