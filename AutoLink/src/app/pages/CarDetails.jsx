import { useParams, useNavigate } from 'react-router';
import { useState } from 'react';
import { ArrowLeft, Calendar, Gauge, Fuel, Car, Palette, Settings, Heart, Share2, Phone, FileText, X } from 'lucide-react';
import { useCars } from '../context/CarContext';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useProposals } from '../context/ProposalsContext';

export function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCarById } = useCars();
  const { user, isAdmin } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addProposal, hasProposalForCar } = useProposals();
  const car = getCarById(Number(id));

  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposedPrice, setProposedPrice] = useState('');
  const [proposalMessage, setProposalMessage] = useState('');
  const [proposalSent, setProposalSent] = useState(false);

  if (!car) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-muted-foreground">Carro não encontrado</p>
        <div className="text-center mt-4">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Voltar para o estoque
          </button>
        </div>
      </div>
    );
  }

  const favorited = isFavorite(car.id);
  const alreadyProposed = user ? hasProposalForCar(car.id, user.id) : false;

  const handleSubmitProposal = (e) => {
    e.preventDefault();
    if (!user) return;
    addProposal({
      carId: car.id,
      carBrand: car.brand,
      carModel: car.model,
      carYear: car.year,
      carImage: car.image,
      carPrice: car.price,
      userId: user.id,
      userName: user.name,
      proposedPrice: Number(proposedPrice),
      message: proposalMessage,
    });
    setProposalSent(true);
    setShowProposalForm(false);
    setProposedPrice('');
    setProposalMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para o estoque
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg overflow-hidden border border-border mb-6">
            <img
              src={car.image}
              alt={`${car.brand} ${car.model}`}
              className="w-full h-96 object-cover"
            />
          </div>

          <div className="bg-card rounded-lg border border-border p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl mb-2">{car.brand} {car.model}</h1>
                <p className="text-muted-foreground">{car.year}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Preço</p>
                <p className="text-3xl text-primary">
                  R$ {car.price.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-6 border-y border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  <Gauge className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quilometragem</p>
                  <p>{car.mileage.toLocaleString('pt-BR')} km</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ano</p>
                  <p>{car.year}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  <Fuel className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Combustível</p>
                  <p>{car.fuel}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Câmbio</p>
                  <p>{car.transmission}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cor</p>
                  <p>{car.color}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <p>Sedan</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="mb-3">Descrição</h3>
              <p className="text-muted-foreground leading-relaxed">{car.description}</p>
            </div>
          </div>

          {car.features && car.features.length > 0 && (
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="mb-4">Equipamentos e Opcionais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {car.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border border-border p-6 sticky top-4">
            <h3 className="mb-4">Interessado?</h3>

            <div className="space-y-3 mb-6">
              <a
                href="tel:+5511987654321"
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Ligar para Vendedor
              </a>

              <button
                onClick={() => navigate('/financiamento')}
                className="w-full py-3 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Simular Financiamento
              </button>

              {/* Favorites Button */}
              <button
                onClick={() => toggleFavorite(car.id)}
                className={`w-full py-3 border rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  favorited
                    ? 'bg-destructive/10 border-destructive text-destructive hover:bg-destructive/20'
                    : 'border-border hover:bg-muted'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-destructive' : ''}`} />
                {favorited ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
              </button>

              {/* Proposal Button — only for logged-in regular users */}
              {user && !isAdmin && (
                <>
                  {proposalSent || alreadyProposed ? (
                    <div className="w-full py-3 border border-green-500 bg-green-50 text-green-700 rounded-lg flex items-center justify-center gap-2 text-sm">
                      <FileText className="w-4 h-4" />
                      Proposta enviada com sucesso!
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowProposalForm(!showProposalForm)}
                      className="w-full py-3 border border-border rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Fazer Proposta
                    </button>
                  )}
                </>
              )}

              {!user && (
                <p className="text-xs text-muted-foreground text-center">
                  Faça login para enviar uma proposta
                </p>
              )}

              <button className="w-full py-3 border border-border rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" />
                Compartilhar
              </button>
            </div>

            {/* Inline Proposal Form */}
            {showProposalForm && (
              <div className="border border-border rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4>Sua Proposta</h4>
                  <button onClick={() => setShowProposalForm(false)} className="p-1 hover:bg-muted rounded">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <form onSubmit={handleSubmitProposal} className="space-y-3">
                  <div>
                    <label className="block text-sm mb-1">Valor Proposto (R$)</label>
                    <input
                      type="number"
                      value={proposedPrice}
                      onChange={e => setProposedPrice(e.target.value)}
                      placeholder={car.price.toString()}
                      required
                      min={1}
                      className="w-full px-3 py-2 bg-input-background rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Preço anunciado: R$ {car.price.toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Mensagem (opcional)</label>
                    <textarea
                      value={proposalMessage}
                      onChange={e => setProposalMessage(e.target.value)}
                      placeholder="Conte um pouco sobre sua proposta..."
                      rows={3}
                      className="w-full px-3 py-2 bg-input-background rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity text-sm"
                  >
                    Enviar Proposta
                  </button>
                </form>
              </div>
            )}

            <div className="border-t border-border pt-6">
              <h4 className="mb-3">Informações do Vendedor</h4>
              <p className="text-muted-foreground mb-4">
                autoLink Seminovos<br />
                São Paulo, SP
              </p>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  (11) 98765-4321
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
