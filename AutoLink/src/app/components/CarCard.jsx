import { Link, useNavigate } from 'react-router';
import { Car, Gauge, Calendar, Fuel } from 'lucide-react';
import './CarCard.css';

export function CarCard({ id, image, brand, model, year, price, mileage, fuel, transmission, color }) {
  const navigate = useNavigate();
  return (
    <div
      className="car-card"
      onClick={() => navigate(`/carro/${id}`)}
    >
      <div className="car-card">
        <div className="car-card-image-wrapper">
          <img
            src={image}
            alt={`${brand} ${model}`}
            className="car-card-image"
          />
        </div>

        <div className="car-card-body">
          <div className="car-card-title">
            <h3>{brand} {model}</h3>
            <p className="car-card-meta">{year}</p>
          </div>

          <div className="car-card-grid">
            <div className="car-card-feature">
              <Gauge className="w-4 h-4" />
              <span>{mileage.toLocaleString('pt-BR')} km</span>
            </div>
            <div className="car-card-feature">
              <Fuel className="w-4 h-4" />
              <span>{fuel}</span>
            </div>
            <div className="car-card-feature">
              <Car className="w-4 h-4" />
              <span>{transmission}</span>
            </div>
            <div className="car-card-feature">
              <Calendar className="w-4 h-4" />
              <span>{color}</span>
            </div>
          </div>

          <div className="car-card-footer">
            <div>
              <p className="car-card-price-label">Preço</p>
              <p className="car-card-price">
                R$ {price.toLocaleString('pt-BR')}
              </p>
            </div>
            <Link
              to={`/carro/${id}`}
              className="car-card-link"
            >
              Ver Detalhes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
