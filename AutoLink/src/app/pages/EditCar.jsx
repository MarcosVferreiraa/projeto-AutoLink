import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCars } from '../context/CarContext';
import './EditCar.css';

const MARCAS_PREDEFINIDAS = [
  "Toyota", "Volkswagen", "Ford", "Chevrolet", "Honda", 
  "Hyundai", "Fiat", "Jeep", "Nissan", "Renault", "BMW", "Mercedes-Benz"
];

export function EditCar() {
  const { id } = useParams();
  const navigate = useNavigate();
  // Agora 'updateCar' vem corretamente do contexto
  const { getCarById, updateCar } = useCars();

  const [formData, setFormData] = useState({
    brand: '', model: '', year: '', price: '', mileage: '',
    fuel: '', transmission: '', color: '', image: '',
    description: '', features: ''
  });

  useEffect(() => {
    const car = getCarById(id);
    if (car) {
      setFormData({
        brand: car.brand || '',
        model: car.model || '',
        year: car.year || '',
        price: car.price || '',
        mileage: car.mileage || '',
        fuel: car.fuel || '',
        transmission: car.transmission || '',
        color: car.color || '',
        image: car.image || '',
        description: car.description || '',
        features: Array.isArray(car.features) ? car.features.join(', ') : (car.features || '')
      });
    }
  }, [id, getCarById]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Converte de volta para Array antes de enviar
    const featuresArray = formData.features
      ? formData.features.split(',').map(f => f.trim()).filter(f => f.length > 0)
      : [];

    try {
      await updateCar(id, { ...formData, features: featuresArray });
      navigate(-1);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar alterações.");
    }
  };

  return (
    <div className="edit-car-container">
      <h1>Editar Veículo</h1>
      <form onSubmit={handleSubmit} className="edit-car-form">
        <div className="form-field-group">
          <label>Marca</label>
          <select name="brand" value={formData.brand} onChange={handleChange} required>
            <option value="">Selecione uma marca</option>
            {MARCAS_PREDEFINIDAS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        
        {/* Campos mantidos exatamente conforme a sua estrutura original */}
        <div className="form-field-group">
          <label>Modelo</label>
          <input type="text" name="model" value={formData.model} onChange={handleChange} required />
        </div>

        <div className="form-grid-2cols">
          <div className="form-field-group">
            <label>Ano</label>
            <input type="number" name="year" value={formData.year} onChange={handleChange} required />
          </div>
          <div className="form-field-group">
            <label>Preço</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-field-group">
          <label>Quilometragem</label>
          <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} required />
        </div>

        <div className="form-grid-2cols">
          <div className="form-field-group">
            <label>Combustível</label>
            <input type="text" name="fuel" value={formData.fuel} onChange={handleChange} required />
          </div>
          <div className="form-field-group">
            <label>Câmbio</label>
            <input type="text" name="transmission" value={formData.transmission} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-field-group">
          <label>Cor</label>
          <input type="text" name="color" value={formData.color} onChange={handleChange} required />
        </div>

        <div className="form-field-group">
          <label>URL da Imagem</label>
          <input type="text" name="image" value={formData.image} onChange={handleChange} required />
        </div>

        <div className="form-field-group">
          <label>Descrição</label>
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </div>

        <div className="form-field-group">
          <label>Equipamentos (separados por vírgula)</label>
          <textarea name="features" value={formData.features} onChange={handleChange} />
        </div>

        <div className="form-actions-zone">
          <button type="submit" className="btn-save-car">Salvar Alterações</button>
          <button type="button" onClick={() => navigate(-1)} className="btn-cancel-edit">Cancelar</button>
        </div>
      </form>
    </div>
  );
}