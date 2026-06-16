import { createContext, useContext, useState } from 'react';

const CarsContext = createContext(undefined);

const initialCars = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1618642624018-a370cbf3cd80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    brand: 'Mercedes-Benz',
    model: 'C200',
    year: 2021,
    price: 185000,
    mileage: 45000,
    fuel: 'Gasolina',
    transmission: 'Automático',
    color: 'Branco',
    description: 'Mercedes-Benz C200 em excelente estado de conservação, único dono e revisões na concessionária.',
    features: ['Teto solar', 'Bancos em couro', 'Ar condicionado digital', 'Sensor de estacionamento']
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    brand: 'BMW',
    model: '320i',
    year: 2022,
    price: 239000,
    mileage: 28000,
    fuel: 'Flex',
    transmission: 'Automático',
    color: 'Preto',
    description: 'BMW 320i M Sport, performance e sofisticação combinadas. Sistema de som premium Harman Kardon.',
    features: ['Painel digital', 'Faróis em LED', 'Piloto automático adaptativo', 'Rodas aro 19']
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    brand: 'Porsche',
    model: '911 Carrera',
    year: 2020,
    price: 780000,
    mileage: 15000,
    fuel: 'Gasolina',
    transmission: 'Automático',
    color: 'Cinza',
    description: 'Porsche 911 Carrera S, um ícone das pistas nas ruas. Cor Giz, interior em couro vermelho Bordeaux.',
    features: ['Escapamento esportivo', 'Pacote Chrono Esporte', 'Bancos elétricos de 18 vias', 'Eixo traseiro direcional']
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    brand: 'Audi',
    model: 'A4',
    year: 2021,
    price: 210000,
    mileage: 35000,
    fuel: 'Gasolina',
    transmission: 'Automático',
    color: 'Azul',
    description: 'Audi A4 Performance Black Quattro. Tração integral e motor de 249cv. Excelente desempenho.',
    features: ['Tração Quattro', 'Teto solar panorâmico', 'Virtual Cockpit', 'Alerta de ponto cego']
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2023,
    price: 148000,
    mileage: 12000,
    fuel: 'Híbrido',
    transmission: 'Automático',
    color: 'Prata',
    description: 'Toyota Corolla Altis Premium Hybrid. Extrema economia de combustível com a confiabilidade Toyota.',
    features: ['Motor híbrido', 'Toyota Safety Sense', 'Chave presencial', 'Carregador por indução']
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    brand: 'Honda',
    model: 'Civic',
    year: 2020,
    price: 125000,
    mileage: 52000,
    fuel: 'Flex',
    transmission: 'Automático',
    color: 'Cinza',
    description: 'Honda Civic EXL, sedan médio completo, ótimo espaço interno e porta-malas generoso.',
    features: ['Central multimídia de 7"', 'Câmera de ré', 'Freio de mão eletrônico', 'Ar condicionado dual zone']
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    brand: 'Chevrolet',
    model: 'Onix',
    year: 2022,
    price: 82000,
    mileage: 25000,
    fuel: 'Flex',
    transmission: 'Manual',
    color: 'Preto',
    description: 'Chevrolet Onix LTZ Turbo. Econômico, ágil e com excelente conectividade Wi-Fi nativa.',
    features: ['Motor turbo', 'MyLink com Android Auto/CarPlay', 'Direção elétrica', '6 Airbags']
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    brand: 'Volkswagen',
    model: 'Golf GTI',
    year: 2019,
    price: 169000,
    mileage: 58000,
    fuel: 'Gasolina',
    transmission: 'Automático',
    color: 'Branco',
    description: 'Volkswagen Golf GTI MK7.5. O legítimo hot hatch, sem modificações, todo original.',
    features: ['Painel digital TFT', 'Modos de condução', 'Direção elétrica', 'Vidros elétricos', 'Freios ABS']
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1625510874369-c21e25f99360?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    brand: 'Audi',
    model: 'A3',
    year: 2021,
    price: 155000,
    mileage: 32000,
    fuel: 'Gasolina',
    transmission: 'Automático',
    color: 'Vermelho',
    description: 'Audi A3 sportback com design arrojado. Baixa quilometragem.',
    features: ['Ar condicionado digital', 'Direção elétrica', 'Vidros elétricos', 'Airbags', 'Freios ABS']
  }
];

export function CarsProvider({ children }) {
  const [cars, setCars] = useState(initialCars);
  const [nextId, setNextId] = useState(10);

  const addCar = (carData) => {
    const newCar = {
      ...carData,
      id: nextId
    };
    setCars(prev => [newCar, ...prev]);
    setNextId(prev => prev + 1);
  };

  const removeCar = (id) => {
    setCars(prev => prev.filter(car => car.id !== id));
  };

  const getCarById = (id) => cars.find(car => car.id === id);

  return (
    <CarsContext.Provider value={{ cars, addCar, removeCar, getCarById }}>
      {children}
    </CarsContext.Provider>
  );
}

export function useCars() {
  const context = useContext(CarsContext);
  if (context === undefined) {
    throw new Error('useCars deve ser usado dentro de um CarsProvider');
  }
  return context;
}