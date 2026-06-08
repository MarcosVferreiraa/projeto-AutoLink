import React from 'react';
import { Link } from 'react-router';
import { Car, Gauge, Calendar, Fuel } from 'lucide-react';
export function CarCard({
  id,
  image,
  brand,
  model,
  year,
  price,
  mileage,
  fuel,
  transmission,
  color
}) {
  return <div className="bg-card rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-lg transition-shadow"><div className="relative h-48 bg-muted overflow-hidden"><img src={image} alt={`${brand} ${model}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" /></div><div className="p-4"><div className="mb-3"><h3 className="mb-1">{brand} {model}</h3><p className="text-muted-foreground">{year}</p></div><div className="grid grid-cols-2 gap-2 mb-4 text-muted-foreground"><div className="flex items-center gap-2"><Gauge className="w-4 h-4" /><span className="text-sm">{mileage.toLocaleString('pt-BR')} km</span></div><div className="flex items-center gap-2"><Fuel className="w-4 h-4" /><span className="text-sm">{fuel}</span></div><div className="flex items-center gap-2"><Car className="w-4 h-4" /><span className="text-sm">{transmission}</span></div><div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span className="text-sm">{color}</span></div></div><div className="flex items-center justify-between pt-3 border-t border-border"><div><p className="text-sm text-muted-foreground">Preço</p><p className="text-primary">R$ {price.toLocaleString('pt-BR')}</p></div><Link to={`/carro/${id}`} className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity">Ver Detalhes</Link></div></div></div>;
}