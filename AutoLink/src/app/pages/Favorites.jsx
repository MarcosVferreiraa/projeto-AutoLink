import { Heart, X } from 'lucide-react';
import { Link } from 'react-router';
import { CarCard } from '../components/CarCard';
import { useCars } from '../context/CarContext';
import { useFavorites } from '../context/FavoritesContext';
import './Favorites.css'; 

export function Favorites() {
  const { getCarById } = useCars();
  const { favoriteIds, removeFavorite } = useFavorites();

  const favoriteCars = favoriteIds
    .map(id => getCarById(id))
    .filter(car => car !== undefined);

  return (
    <div className="favorites-container">
      <div className="favorites-header-section">
        <div className="favorites-title-wrapper">
          <Heart className="w-8 h-8 text-destructive" />
          <h1>Meus Favoritos</h1>
        </div>
        <p>
          Você tem {favoriteCars.length} {favoriteCars.length === 1 ? 'veículo favorito' : 'veículos favoritos'}
        </p>
      </div>

      {favoriteCars.length > 0 ? (
        <div className="favorites-grid">
          {favoriteCars.map(car => (
            <div key={car.id} className="favorite-card-wrapper">
              <CarCard {...car} />
              <button
                onClick={() => removeFavorite(car.id)}
                title="Remover dos favoritos"
                className="btn-remove-favorite"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="favorites-empty-state">
          <Heart className="favorites-empty-icon" />
          <h3>Nenhum favorito ainda</h3>
          <p>
            Adicione carros aos seus favoritos para encontrá-los facilmente depois
          </p>
          <Link to="/" className="btn-go-stock">
            Ver Estoque
          </Link>
        </div>
      )}
    </div>
  );
}