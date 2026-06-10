import { X, Upload } from "lucide-react";
import { useState } from "react";
import styles from './AddCarModal.module.css';

interface AddCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCar: (car: {
    image: string;
    brand: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    fuel: string;
    transmission: string;
    color: string;
    description: string;
    features: string[];
  }) => void;
}

export function AddCarModal({
  isOpen,
  onClose,
  onAddCar,
}: AddCarModalProps) {
  const [formData, setFormData] = useState({
    image: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    fuel: "Flex",
    transmission: "Automático",
    color: "",
    description: "",
    features: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const featuresArray = formData.features
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    onAddCar({
      ...formData,
      features: featuresArray,
    });

    setFormData({
      image: "",
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      fuel: "Flex",
      transmission: "Automático",
      color: "",
      description: "",
      features: "",
    });

    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "year" || name === "price" || name === "mileage"
          ? Number(value)
          : value,
    }));
  };

  return (
    <div className={styles.addCarModalOverlay}>
      <div className={styles.addCarModalPanel}>
        <div className={styles.addCarModalHeader}>
          <h2>Adicionar Novo Carro</h2>
          <button onClick={onClose} className={styles.addCarModalClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.addCarModalForm}>
          <div className={styles.addCarModalGrid}>
            <div className={styles.colSpan2}>
              <label className={styles.addCarModalLabel}>URL da Imagem</label>
              <div className={styles.addCarModalGroup}>
                <Upload className={styles.inputIcon} size={18} />
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://exemplo.com/imagem.jpg"
                  required
                  className={styles.addCarModalInput}
                />
              </div>
            </div>

            <div>
              <label className={styles.addCarModalLabel}>Marca</label>
              <select
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                className={styles.addCarModalSelect}
              >
                <option value="">Selecione...</option>
                <option value="BMW">BMW</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="Audi">Audi</option>
                <option value="Toyota">Toyota</option>
                <option value="Honda">Honda</option>
                <option value="Volkswagen">Volkswagen</option>
                <option value="Chevrolet">Chevrolet</option>
                <option value="Ford">Ford</option>
                <option value="Hyundai">Hyundai</option>
                <option value="Nissan">Nissan</option>
                <option value="Jeep">Jeep</option>
                <option value="Fiat">Fiat</option>
              </select>
            </div>

            <div>
              <label className={styles.addCarModalLabel}>Modelo</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="Ex: Civic, Corolla..."
                required
                className={styles.addCarModalInput}
              />
            </div>

            <div>
              <label className={styles.addCarModalLabel}>Ano</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="1990"
                max={new Date().getFullYear() + 1}
                required
                className={styles.addCarModalInput}
              />
            </div>

            <div>
              <label className={styles.addCarModalLabel}>Preço (R$)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                required
                className={styles.addCarModalInput}
              />
            </div>

            <div>
              <label className={styles.addCarModalLabel}>Quilometragem (km)</label>
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                min="0"
                required
                className={styles.addCarModalInput}
              />
            </div>

            <div>
              <label className={styles.addCarModalLabel}>Combustível</label>
              <select
                name="fuel"
                value={formData.fuel}
                onChange={handleChange}
                required
                className={styles.addCarModalSelect}
              >
                <option value="Gasolina">Gasolina</option>
                <option value="Flex">Flex</option>
                <option value="Diesel">Diesel</option>
                <option value="Elétrico">Elétrico</option>
                <option value="Híbrido">Híbrido</option>
              </select>
            </div>

            <div>
              <label className={styles.addCarModalLabel}>Câmbio</label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                required
                className={styles.addCarModalSelect}
              >
                <option value="Automático">Automático</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div>
              <label className={styles.addCarModalLabel}>Cor</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="Ex: Preto, Branco..."
                required
                className={styles.addCarModalInput}
              />
            </div>

            <div className={styles.colSpan2}>
              <label className={styles.addCarModalLabel}>Descrição</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Descreva as características e estado do veículo..."
                required
                className={styles.addCarModalTextarea}
              />
            </div>

            <div className={styles.colSpan2}>
              <label className={styles.addCarModalLabel}>Equipamentos (separados por vírgula)</label>
              <textarea
                name="features"
                value={formData.features}
                onChange={handleChange}
                rows={3}
                placeholder="Ex: Ar condicionado, Direção elétrica, Airbags, Freios ABS..."
                className={styles.addCarModalTextarea}
              />
            </div>
          </div>

          <div className={styles.addCarModalButtonRow}>
            <button type="submit" className={styles.addCarModalSubmit}>
              Adicionar Carro
            </button>
            <button
              type="button"
              onClick={onClose}
              className={styles.addCarModalCancel}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}