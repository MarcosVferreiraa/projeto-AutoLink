import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useCars } from '../context/CarContext';
import './EditCar.css';
export function EditCar() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { getCarById, updateCar, loading } = useCars();

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    fuel: '',
    transmission: '',
    color: '',
    image: '',
    description: ''
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
        description: car.description || ''
      });
    }
  }, [id, getCarById]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Garante que campos numéricos críticos sejam salvos corretamente no banco
      const updatedData = {
        ...formData,
        year: Number(formData.year),
        price: Number(formData.price),
        mileage: Number(formData.mileage)
      };

      await updateCar(id, updatedData);
      alert("Veículo atualizado com sucesso!");
      navigate(`/carro/${id}`);
    } catch (error) {
      console.error("Erro ao atualizar o carro:", error);
      alert("Erro ao salvar as alterações.");
    }
  };

  if (loading) {
    return <div className="edit-car-loading">Carregando dados do veículo...</div>;
  }

  return (
    <div className="edit-car-container">
      <h1>Editar Cadastro do Veículo</h1>

      <form onSubmit={handleSubmit} className="edit-car-form">
        <div className="form-grid-2cols">
          <div className="form-field-group">
            <label>Marca</label>
            <input type="text" name="brand" value={formData.brand} onChange={handleChange} required />
          </div>
          <div className="form-field-group">
            <label>Modelo</label>
            <input type="text" name="model" value={formData.model} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-grid-2cols">
          <div className="form-field-group">
            <label>Ano</label>
            <input type="number" name="year" value={formData.year} onChange={handleChange} required />
          </div>
          <div className="form-field-group">
            <label>Preço (R$)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-grid-2cols">
          <div className="form-field-group">
            <label>Quilometragem (km)</label>
            <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} required />
          </div>
          <div className="form-field-group">
            <label>Cor</label>
            <input type="text" name="color" value={formData.color} onChange={handleChange} required />
          </div>
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
          <label>URL da Imagem</label>
          <input type="text" name="image" value={formData.image} onChange={handleChange} required />
        </div>

        <div className="form-field-group">
          <label>Descrição do Veículo</label>
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </div>

        <div className="form-actions-zone">
          <button type="submit" className="btn-save-car">
            Salvar Alterações
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-cancel-edit">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}