import { useState } from 'react';
import { useNavigate } from 'react-router';
import { FilterSidebar } from '../components/FilterSidebar';
import { CarCard } from '../components/CarCard';
import { AddCarModal } from '../components/AddCarModal';
import { LoginModal } from '../components/LoginModal';
import { useCars } from '../context/CarContext'
import { useAuth } from '../context/AuthContext';
import { Search, Plus, Trash2 } from 'lucide-react';
import "./Home.css"; 

export function Home() {
  const navigate = useNavigate();
  const { cars, addCar, removeCar } = useCars();
  const { user, isAdmin } = useAuth();
  
  const [isAddCarModalOpen, setIsAddCarModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // Estado para controlar o modal de login
  
  // Estado para os filtros da Sidebar lateral esquerda
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

  // ESTADO DO FILTRO DA DIREITA: Guarda o critério de ordenação selecionado
  const [sortCriterion, setSortCriterion] = useState('');

  // Função para abrir o modal com verificação de segurança
  const handleOpenAddModal = () => {
    if (!user) {
      alert("Você precisa estar logado para anunciar um veículo!");
      setIsLoginModalOpen(true); //  Abre o modal de login diretamente em vez de redirecionar
    } else {
      setIsAddCarModalOpen(true); 
    }
  };

  // Função para injetar o ID do proprietário do veículo antes de salvar
  const handleAddCarWithUser = async (newCarData) => {
    try {
      const carWithAuthor = {
        ...newCarData,
        userId: user.uid || user.id 
      };
      await addCar(carWithAuthor);
    } catch (error) {
      console.error("Erro ao adicionar veículo:", error);
    }
  };

  // filtros da Sidebar esquerda
  const filteredCars = cars.filter(car => {
    const matchesSearch = filters.search === '' ||
      (car.brand && car.brand.toLowerCase().includes(filters.search.toLowerCase())) ||
      (car.model && car.model.toLowerCase().includes(filters.search.toLowerCase()));
    
    const matchesBrand = filters.brand === '' || car.brand === filters.brand;
    
    const matchesMinPrice = filters.minPrice === '' || Number(car.price) >= Number(filters.minPrice);
    const matchesMaxPrice = filters.maxPrice === '' || Number(car.price) <= Number(filters.maxPrice);
    
    const matchesMinYear = filters.minYear === '' || Number(car.year) >= Number(filters.minYear);
    const matchesMaxYear = filters.maxYear === '' || Number(car.year) <= Number(filters.maxYear);
    
    const matchesFuel = filters.fuel === '' || car.fuel === filters.fuel;
    const matchesTransmission = filters.transmission === '' || car.transmission === filters.transmission;

    return matchesSearch && matchesBrand && matchesMinPrice && matchesMaxPrice &&
           matchesMinYear && matchesMaxYear && matchesFuel && matchesTransmission;
  });

  // ordenação do filtro da direita nos carros filtrados
  const sortedAndFilteredCars = [...filteredCars].sort((a, b) => {
    if (sortCriterion === 'Preço (menor)') {
      return Number(a.price) - Number(b.price);
    }
    if (sortCriterion === 'Preço (maior)') {
      return Number(b.price) - Number(a.price);
    }
    if (sortCriterion === 'Ano (mais novo)') {
      return Number(b.year) - Number(a.year);
    }
    if (sortCriterion === 'Km (menor)') {
      return Number(a.mileage) - Number(b.mileage);
    }
    return 0; 
  });

  return (
    <>
      {/* Modal de Criação de Carros */}
      <AddCarModal
        isOpen={isAddCarModalOpen}
        onClose={() => setIsAddCarModalOpen(false)}
        onAddCar={handleAddCarWithUser}
      />

      {/* 4. Modal de Login inserido na árvore de renderização */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Botão Flutuante */}
      <button
        onClick={handleOpenAddModal}
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
                  {sortedAndFilteredCars.length} {sortedAndFilteredCars.length === 1 ? 'veículo encontrado' : 'veículos encontrados'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select 
                  className="px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={sortCriterion}
                  onChange={(e) => setSortCriterion(e.target.value)}
                >
                  <option value="">Ordenar por: Padrão</option>
                  <option value="Preço (menor)">Ordenar por: Preço (menor)</option>
                  <option value="Preço (maior)">Ordenar por: Preço (maior)</option>
                  <option value="Ano (mais novo)">Ordenar por: Ano (mais novo)</option>
                  <option value="Km (menor)">Ordenar por: Km (menor)</option>
                </select>
              </div>
            </div>

            {sortedAndFilteredCars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedAndFilteredCars.map(car => (
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