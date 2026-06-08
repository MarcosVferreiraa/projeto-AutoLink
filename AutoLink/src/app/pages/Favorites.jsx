import React from 'react';
import { Heart } from 'lucide-react';
import { CarCard } from '../components/CarCard';
const mockFavorites = [{
  id: 1,
  image: 'https://images.unsplash.com/photo-1618642624018-a370cbf3cd80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  brand: 'Mercedes-Benz',
  model: 'C200',
  year: 2021,
  price: 185000,
  mileage: 45000,
  fuel: 'Gasolina',
  transmission: 'Automático',
  color: 'Branco'
}, {
  id: 3,
  image: 'https://images.unsplash.com/photo-1615563868638-98253a7dc33b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  brand: 'Audi',
  model: 'A4',
  year: 2022,
  price: 195000,
  mileage: 28000,
  fuel: 'Flex',
  transmission: 'Automático',
  color: 'Preto'
}, {
  id: 9,
  image: 'https://images.unsplash.com/photo-1625510874369-c21e25f99360?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  brand: 'Audi',
  model: 'A3',
  year: 2021,
  price: 155000,
  mileage: 32000,
  fuel: 'Gasolina',
  transmission: 'Automático',
  color: 'Vermelho'
}];
export function Favorites() {
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div className="mb-8"><div className="flex items-center gap-3 mb-2"><Heart className="w-8 h-8 text-destructive" /><h1>Meus Favoritos</h1></div><p className="text-muted-foreground">Você tem {mockFavorites.length} {mockFavorites.length === 1 ? 'veículo favorito' : 'veículos favoritos'}</p></div>{mockFavorites.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{mockFavorites.map(car => <CarCard key={car.id} {...car} />)}</div> : <div className="text-center py-16 bg-card rounded-lg border border-border"><Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" /><h3 className="mb-2">Nenhum favorito ainda</h3><p className="text-muted-foreground mb-6">Adicione carros aos seus favoritos para encontrá-los facilmente depois</p><a href="/" className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">Ver Estoque</a></div>}</div>;
}