import { useState } from 'react';
import { useNavigate } from 'react-router';
import { FilterSidebar } from '../components/FilterSidebar';
import { CarCard } from '../components/CarCard';
import { AddCarModal } from '../components/AddCarModal';
import { useCars } from '../context/CarContext';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, Trash2 } from 'lucide-react';
import "./home.css"; 

export function Home() {
  const navigate = useNavigate();
  const { cars, addCar, removeCar } = useCars();
  const { isAdmin } = useAuth();
  
  const [isAddCarModalOpen, setIsAddCarModalOpen] = useState(false);
  
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

  const filteredCars = cars.filter(car => {
    const matchesSearch = filters.search === '' ||
      car.brand.toLowerCase().includes(filters.search.toLowerCase()) ||
      car.model.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesBrand = filters.brand === '' || car.brand === filters.brand;
    const matchesMinPrice = filters.minPrice === '' || car.price >= Number(filters.minPrice);
    const matchesMaxPrice = filters.maxPrice === '' || car.price <= Number(filters.maxPrice);
    const matchesMinYear = filters.minYear === '' || car.year >= Number(filters.minYear);
    const matchesMaxYear = filters.maxYear === '' || car.year <= Number(filters.maxYear);
    const matchesFuel = filters.fuel === '' || car.fuel === filters.fuel;
    const matchesTransmission = filters.transmission === '' || car.transmission === filters.transmission;

    return matchesSearch && matchesBrand && matchesMinPrice && matchesMaxPrice &&
           matchesMinYear && matchesMaxYear && matchesFuel && matchesTransmission;
  });

  return (
    <>
      <AddCarModal
        isOpen={isAddCarModalOpen}
        onClose={() => setIsAddCarModalOpen(false)}
        onAddCar={addCar}
      />

      {/* Botão Flutuante - Adicionar Carro (visível para todos) */}
      <button
        onClick={() => setIsAddCarModalOpen(true)}
        className="floating-add-btn"
        aria-label="Adicionar carro"
      >
        <Plus size={28} />
      </button>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl mb-4">
              Encontre o Carro dos Seus Sonhos
            </h1>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Os melhores seminovos com procedência garantida e condições especiais de financiamento
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
                className="px-6 py-3 bg-primary-foreground text-primary rounded-lg hover:opacity-90 transition-opacity"
              >
                Ver Estoque Completo
              </button>
              <button
                onClick={() => navigate('/financiamento')}
                className="px-6 py-3 bg-transparent border-2 border-primary-foreground text-primary-foreground rounded-lg hover:bg-primary-foreground/10 transition-colors"
              >
                Simular Financiamento
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <FilterSidebar onFilterChange={setFilters} />
          </aside>

          <main className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2>Carros Disponíveis</h2>
                <p className="text-muted-foreground">
                  {filteredCars.length} {filteredCars.length === 1 ? 'veículo encontrado' : 'veículos encontrados'}
                </p>
              </div>
              <select className="px-4 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Ordenar por: Menor preço</option>
                <option>Ordenar por: Maior preço</option>
                <option>Ordenar por: Ano (mais novo)</option>
                <option>Ordenar por: Km (menor)</option>
              </select>
            </div>

            {filteredCars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCars.map(car => (
                  <div key={car.id} className="relative">
                    <CarCard {...car} />
                    {isAdmin && (
                      <button
                        onClick={() => removeCar(car.id)}
                        title="Remover carro"
                        className="absolute top-3 right-3 w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-md hover:opacity-90 transition-opacity z-10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-card rounded-lg border border-border">
                <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="mb-2">Nenhum veículo encontrado</h3>
                <p className="text-muted-foreground">
                  Tente ajustar os filtros para ver mais resultados
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}