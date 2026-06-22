import { X, Upload } from "lucide-react";
import { useState } from "react";
import styles from './AddCarModal.module.css';

export function AddCarModal({ isOpen, onClose, onAddCar }) {
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
  const [errors, setErrors] = useState({});


  if (!isOpen) return null;


  const validateForm = () => {
    const newErrors = {};

    if (!formData.image.trim()) {
      newErrors.image = "Informe a URL da imagem";
    } else {
      try {
        new URL(formData.image);
      } catch {
        newErrors.image = "URL inválida";
      }
    }

    if (!formData.brand) {
      newErrors.brand = "Selecione uma marca";
    }

    if (!formData.model.trim()) {
      newErrors.model = "Informe o modelo";
    }

    if (
      formData.year < 1990 ||
      formData.year > new Date().getFullYear() + 1
    ) {
      newErrors.year = "Ano inválido";
    }

    if (formData.price <= 0) {
      newErrors.price = "Informe um preço válido";
    }

    if (formData.mileage < 0) {
      newErrors.mileage = "Quilometragem inválida";
    }

    if (!formData.color.trim()) {
      newErrors.color = "Informe a cor";
    }

    if (formData.description.trim().length < 20) {
      newErrors.description =
        "A descrição deve ter pelo menos 20 caracteres";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

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

    setErrors({});

    onClose();
  };


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "year" ||
          name === "price" ||
          name === "mileage"
          ? Number(value)
          : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
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

                  className={`${styles.addCarModalInput} ${styles.addCarModalImageInput}${errors.image ? styles.inputError : ""}`}
                />
              </div>
              {errors.image && (
                <span className={styles.errorMessage}>
                  {errors.image}
                </span>
              )}
            </div>

            <div>
              <label className={styles.addCarModalLabel}>Marca</label>

              <select
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className={`${styles.addCarModalSelect} ${errors.brand ? styles.inputError : ""
                  }`}
              >
                <option value="Audi">Audi</option>
                <option value="BMW">BMW</option>
                <option value="Chevrolet">Chevrolet</option>
                <option value="Ferrari">Ferrari</option>
                <option value="Fiat">Fiat</option>
                <option value="Ford">Ford</option>
                <option value="Honda">Honda</option>
                <option value="Hyundai">Hyundai</option>
                <option value="Jeep">Jeep</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="Nissan">Nissan</option>
                <option value="Porsche">Porsche</option>
                <option value="Toyota">Toyota</option>
                <option value="Volkswagen">Volkswagen</option>
              </select>

              {errors.brand && (
                <span className={styles.errorMessage}>
                  {errors.brand}
                </span>
              )}
            </div>

            <div>
              <label className={styles.addCarModalLabel}>Modelo</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="Ex: Civic, Corolla..."
                className={`${styles.addCarModalInput} ${errors.model ? styles.inputError : ""
                  }`}
              />

              {errors.model && (
                <span className={styles.errorMessage}>
                  {errors.model}
                </span>
              )}
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
                className={`${styles.addCarModalInput} ${errors.year ? styles.inputError : ""
                  }`}
              />

              {errors.year && (
                <span className={styles.errorMessage}>
                  {errors.year}
                </span>
              )}
            </div>

            <div>
              <label className={styles.addCarModalLabel}>
                Preço (R$)
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                className={`${styles.addCarModalInput} ${errors.price ? styles.inputError : ""
                  }`}
              />

              {errors.price && (
                <span className={styles.errorMessage}>
                  {errors.price}
                </span>
              )}
            </div>

            <div>
              <label className={styles.addCarModalLabel}>
                Quilometragem (km)
              </label>

              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                min="0"
                className={`${styles.addCarModalInput} ${errors.mileage ? styles.inputError : ""
                  }`}
              />

              {errors.mileage && (
                <span className={styles.errorMessage}>
                  {errors.mileage}
                </span>
              )}
            </div>

            <div>
              <label className={styles.addCarModalLabel}>Combustível</label>
              <select
                name="fuel"
                value={formData.fuel}
                onChange={handleChange}

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
                className={`${styles.addCarModalInput} ${errors.color ? styles.inputError : ""
                  }`}
              />

              {errors.color && (
                <span className={styles.errorMessage}>
                  {errors.color}
                </span>
              )}
            </div>

            <div className={styles.colSpan2}>
              <label className={styles.addCarModalLabel}>
                Descrição
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Descreva as características e estado do veículo..."
                className={`${styles.addCarModalTextarea} ${errors.description ? styles.inputError : ""
                  }`}
              />

              {errors.description && (
                <span className={styles.errorMessage}>
                  {errors.description}
                </span>
              )}
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