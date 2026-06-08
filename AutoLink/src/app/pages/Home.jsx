import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { FilterSidebar } from '../components/FilterSidebar';
import { CarCard } from '../components/CarCard';
import { Search } from 'lucide-react';
const mockCars = [{
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
  id: 2,
  image: 'https://images.unsplash.com/photo-1585390062628-be8608aa7d83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  brand: 'BMW',
  model: '320i',
  year: 2020,
  price: 165000,
  mileage: 52000,
  fuel: 'Gasolina',
  transmission: 'Automático',
  color: 'Preto'
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
  id: 4,
  image: 'https://images.unsplash.com/photo-1574023240744-64c47c8c0676?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  brand: 'Toyota',
  model: 'Corolla',
  year: 2021,
  price: 125000,
  mileage: 38000,
  fuel: 'Flex',
  transmission: 'Automático',
  color: 'Prata'
}, {
  id: 5,
  image: 'https://images.unsplash.com/photo-1574023278969-abb7ab49945c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  brand: 'Honda',
  model: 'Civic',
  year: 2020,
  price: 115000,
  mileage: 48000,
  fuel: 'Flex',
  transmission: 'Automático',
  color: 'Preto'
}, {
  id: 6,
  image: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  brand: 'Volkswagen',
  model: 'Jetta',
  year: 2019,
  price: 98000,
  mileage: 62000,
  fuel: 'Flex',
  transmission: 'Automático',
  color: 'Branco'
}, {
  id: 7,
  image: 'https://images.unsplash.com/photo-1685091955352-4bb8796aef12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  brand: 'Chevrolet',
  model: 'Cruze',
  year: 2020,
  price: 89000,
  mileage: 55000,
  fuel: 'Flex',
  transmission: 'Automático',
  color: 'Prata'
}, {
  id: 8,
  image: 'https://images.unsplash.com/photo-1692863211226-cbba732754c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  brand: 'Ford',
  model: 'Fusion',
  year: 2019,
  price: 92000,
  mileage: 68000,
  fuel: 'Gasolina',
  transmission: 'Automático',
  color: 'Azul'
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
export function Home() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
    fuel: '',
    transmission: ''
  });
  const filteredCars = mockCars.filter(car => {
    const matchesSearch = filters.search === '' || car.brand.toLowerCase().includes(filters.search.toLowerCase()) || car.model.toLowerCase().includes(filters.search.toLowerCase());
    const matchesBrand = filters.brand === '' || car.brand === filters.brand;
    const matchesMinPrice = filters.minPrice === '' || car.price >= Number(filters.minPrice);
    const matchesMaxPrice = filters.maxPrice === '' || car.price <= Number(filters.maxPrice);
    const matchesMinYear = filters.minYear === '' || car.year >= Number(filters.minYear);
    const matchesMaxYear = filters.maxYear === '' || car.year <= Number(filters.maxYear);
    const matchesFuel = filters.fuel === '' || car.fuel === filters.fuel;
    const matchesTransmission = filters.transmission === '' || car.transmission === filters.transmission;
    return matchesSearch && matchesBrand && matchesMinPrice && matchesMaxPrice && matchesMinYear && matchesMaxYear && matchesFuel && matchesTransmission;
  });
  return <><div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"><div className="max-w-3xl"><h1 className="text-4xl md:text-5xl mb-4">Encontre o Carro dos Seus Sonhos</h1><p className="text-xl mb-8 text-primary-foreground/90">Os melhores seminovos com procedência garantida e condições especiais de financiamento</p><div className="flex gap-4"><button onClick={() => window.scrollTo({
              top: 600,
              behavior: 'smooth'
            })} className="px-6 py-3 bg-primary-foreground text-primary rounded-lg hover:opacity-90 transition-opacity">Ver Estoque Completo</button><button onClick={() => navigate('/financiamento')} className="px-6 py-3 bg-transparent border-2 border-primary-foreground text-primary-foreground rounded-lg hover:bg-primary-foreground/10 transition-colors">Simular Financiamento</button></div></div></div></div>{/* Main Content */}<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div className="grid grid-cols-1 lg:grid-cols-4 gap-8"><aside className="lg:col-span-1"><FilterSidebar onFilterChange={setFilters} /></aside>{/* Car Grid */}<main className="lg:col-span-3"><div className="flex items-center justify-between mb-6"><div><h2>Carros Disponíveis</h2><p className="text-muted-foreground">{filteredCars.length} {filteredCars.length === 1 ? 'veículo encontrado' : 'veículos encontrados'}</p></div><select className="px-4 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"><option>Ordenar por: Menor preço</option><option>Ordenar por: Maior preço</option><option>Ordenar por: Ano (mais novo)</option><option>Ordenar por: Km (menor)</option></select></div>{filteredCars.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">{filteredCars.map(car => <CarCard key={car.id} {...car} />)}</div> : <div className="text-center py-16 bg-card rounded-lg border border-border"><Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" /><h3 className="mb-2">Nenhum veículo encontrado</h3><p className="text-muted-foreground">Tente ajustar os filtros para ver mais resultados</p></div>}</main></div></div></>;
}