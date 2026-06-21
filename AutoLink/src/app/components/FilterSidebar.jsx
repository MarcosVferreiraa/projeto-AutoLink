import { Search, SlidersHorizontal } from 'lucide-react';
import './FilterSidebar.css';

export function FilterSidebar({ onFilterChange }) {
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Atualiza o estado "filters" dentro do componente Pai (Home.jsx)
    onFilterChange((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="filter-sidebar">
      <div className="filter-sidebar-header">
        <SlidersHorizontal className="w-5 h-5" />
        <h2>Filtros</h2>
      </div>

      <div className="filter-sidebar-section">
        {/* Campo de pesquisa de texto livre */}
        <div>
          <label className="filter-sidebar-label">Buscar</label>
          <div className="filter-sidebar-relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              name="search"
              placeholder="Marca ou modelo..."
              onChange={handleChange}
              className="filter-sidebar-input filter-sidebar-search-input"
            />
          </div>
        </div>

        {/* Menu de seleção de marcas */}
        <div>
          <label className="filter-sidebar-label">Marca</label>
          <select
            name="brand"
            onChange={handleChange}
            className="filter-sidebar-select"
          >
            <option value="">Todas</option>
            <option value="BMW">BMW</option>
            <option value="Mercedes-Benz">Mercedes-Benz</option>
            <option value="Audi">Audi</option>
            <option value="Toyota">Toyota</option>
            <option value="Honda">Honda</option>
            <option value="Volkswagen">Volkswagen</option>
            <option value="Chevrolet">Chevrolet</option>
            <option value="Ford">Ford</option>
            <option value="Ferrari">Ferrari</option>
            <option value="Porsche">Porsche</option>



          </select>
        </div>

        {/* Filtros de Intervalo de Preços */}
        <div>
          <label className="filter-sidebar-label">Faixa de Preço (R$)</label>
          <div className="filter-sidebar-grid">
            <input
              type="number"
              name="minPrice"
              placeholder="Mín"
              onChange={handleChange}
              className="filter-sidebar-input"
            />
            <input
              type="number"
              name="maxPrice"
              placeholder="Máx"
              onChange={handleChange}
              className="filter-sidebar-input"
            />
          </div>
        </div>

        {/* Filtros de Intervalo de Anos */}
        <div>
          <label className="filter-sidebar-label">Ano Modelo</label>
          <div className="filter-sidebar-grid">
            <input
              type="number"
              name="minYear"
              placeholder="De"
              onChange={handleChange}
              className="filter-sidebar-input"
            />
            <input
              type="number"
              name="maxYear"
              placeholder="Até"
              onChange={handleChange}
              className="filter-sidebar-input"
            />
          </div>
        </div>

        {/* Tipo de combustível */}
        <div>
          <label className="filter-sidebar-label">Combustível</label>
          <select
            name="fuel"
            onChange={handleChange}
            className="filter-sidebar-select"
          >
            <option value="">Todos</option>
            <option value="Gasolina">Gasolina</option>
            <option value="Flex">Flex</option>
            <option value="Diesel">Diesel</option>
            <option value="Elétrico">Elétrico</option>
            <option value="Híbrido">Híbrido</option>
          </select>
        </div>

        {/* Tipo de caixa / transmissão */}
        <div>
          <label className="filter-sidebar-label">Câmbio</label>
          <select
            name="transmission"
            onChange={handleChange}
            className="filter-sidebar-select"
          >
            <option value="">Todos</option>
            <option value="Automático">Automático</option>
            <option value="Manual">Manual</option>
          </select>
        </div>
      </div>
    </div>
  );
}