import { Heart, X } from 'lucide-react';
import { Link } from 'react-router';
import { CarCard } from '../components/CarCard';
import { useCars } from '../context/CarContext';
import { useFavorites } from '../context/FavoritesContext';

export function Favorites() {
  const { getCarById } = useCars();
  const { favoriteIds, removeFavorite } = useFavorites();

  const favoriteCars = favoriteIds
    .map(id => getCarById(id))
    .filter(car => car !== undefined);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-8 h-8 text-destructive" />
          <h1>Meus Favoritos</h1>
        </div>
        <p className="text-muted-foreground">
          Você tem {favoriteCars.length} {favoriteCars.length === 1 ? 'veículo favorito' : 'veículos favoritos'}
        </p>
      </div>

      {favoriteCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteCars.map(car => (
            <div key={car.id} className="relative">
              <CarCard {...car} />
              <button
                onClick={() => removeFavorite(car.id)}
                title="Remover dos favoritos"
                className="absolute top-3 right-3 w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-md hover:opacity-90 transition-opacity z-10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-lg border border-border">
          <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="mb-2">Nenhum favorito ainda</h3>
          <p className="text-muted-foreground mb-6">
            Adicione carros aos seus favoritos para encontrá-los facilmente depois
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
