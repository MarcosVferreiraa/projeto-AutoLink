import { Link, useNavigate } from 'react-router';
import { Car, Gauge, Calendar, Fuel } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import './CarCard.css';

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%236b7280' font-family='Arial,sans-serif' font-size='28'%3EImagem indisponivel%3C/text%3E%3C/svg%3E";

export function CarCard({ id, image, brand, model, year, price, mileage, fuel, transmission, color, createdByName }) {
  const navigate = useNavigate();
  const formattedPrice = Number(price);
  const formattedMileage = Number(mileage);
  const formattedTransmission = /^autom/i.test(transmission || '') ? 'Automático' : transmission;

  return (
    <div
      className="car-card"
      onClick={() => navigate(`/carro/${id}`)}
    >
      <div className="car-card">
        <div className="car-card-image-wrapper">
          <img
            src={image || FALLBACK_IMAGE}
            alt={`${brand} ${model}`}
            className="car-card-image"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
        </div>

        <div className="car-card-body">
          <div className="car-card-title">
            <h3>{brand} {model}</h3>
            <p className="car-card-meta">{year}</p>
            <p className="car-card-author">Anunciante: {createdByName || 'Não informado'}</p>
          </div>

          <div className="car-card-grid">
            <div className="car-card-feature">
              <Gauge className="w-4 h-4" />
              <span>{Number.isFinite(formattedMileage) ? formattedMileage.toLocaleString('pt-BR') : 'Não informado'} km</span>
            </div>
            <div className="car-card-feature">
              <Fuel className="w-4 h-4" />
              <span>{fuel}</span>
            </div>
            <div className="car-card-feature">
              <Car className="w-4 h-4" />
              <span>{formattedTransmission}</span>
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
                {Number.isFinite(formattedPrice) ? formatCurrency(formattedPrice) : 'Preço não informado'}
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