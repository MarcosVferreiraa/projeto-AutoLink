import { createContext, useContext, useState, ReactNode } from 'react';

export interface Car {
  id: number;
  image: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  color: string;
  description?: string;
  features?: string[];
}

interface CarsContextType {
  cars: Car[];
  addCar: (car: Omit<Car, 'id'>) => void;
  removeCar: (id: number) => void;
  getCarById: (id: number) => Car | undefined;
}

const CarsContext = createContext<CarsContextType | undefined>(undefined);

const initialCars: Car[] = [
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
    description: 'Mercedes-Benz C200 em excelente estado de conservação. Veículo único dono, todas as revisões feitas na concessionária. Interior em couro bege, teto solar panorâmico, sistema de som premium.',
    features: ['Ar condicionado digital', 'Direção elétrica', 'Vidros elétricos', 'Trava elétrica', 'Airbags frontais e laterais', 'Freios ABS', 'Sensor de estacionamento', 'Câmera de ré', 'Central multimídia', 'Bancos em couro']
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1585390062628-be8608aa7d83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    brand: 'BMW',
    model: '320i',
    year: 2020,
    price: 165000,
    mileage: 52000,
    fuel: 'Gasolina',
    transmission: 'Automático',
    color: 'Preto',
    description: 'BMW 320i esportivo com performance excepcional. Mantido em garagem, revisões em dia.',
    features: ['Ar condicionado digital', 'Direção elétrica', 'Vidros elétricos', 'Trava elétrica', 'Airbags frontais e laterais', 'Freios ABS', 'Sensor de estacionamento', 'Câmera de ré']
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1615563868638-98253a7dc33b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    brand: 'Audi',
    model: 'A4',
    year: 2022,
    price: 195000,
    mileage: 28000,
    fuel: 'Flex',
    transmission: 'Automático',
    color: 'Preto',
    description: 'Audi A4 seminovo com baixa quilometragem. Tecnologia de ponta e conforto premium.',
    features: ['Ar condicionado digital', 'Direção elétrica', 'Vidros elétricos', 'Trava elétrica', 'Airbags completos', 'Freios ABS', 'Piloto automático']
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1574023240744-64c47c8c0676?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2021,
    price: 125000,
    mileage: 38000,
    fuel: 'Flex',
    transmission: 'Automático',
    color: 'Prata',
    description: 'Toyota Corolla conhecido pela confiabilidade e economia. Perfeito estado.',
    features: ['Ar condicionado', 'Direção elétrica', 'Vidros elétricos', 'Airbags', 'Freios ABS']
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1574023278969-abb7ab49945c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    brand: 'Honda',
    model: 'Civic',
    year: 2020,
    price: 115000,
    mileage: 48000,
    fuel: 'Flex',
    transmission: 'Automático',
    color: 'Preto',
    description: 'Honda Civic em ótimo estado. Design moderno e performance equilibrada.',
    features: ['Ar condicionado', 'Direção elétrica', 'Vidros elétricos', 'Airbags', 'Freios ABS']
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    brand: 'Volkswagen',
    model: 'Jetta',
    year: 2019,
    price: 98000,
    mileage: 62000,
    fuel: 'Flex',
    transmission: 'Automático',
    color: 'Branco',
    description: 'Volkswagen Jetta espaçoso e confortável. Ótima opção custo-benefício.',
    features: ['Ar condicionado', 'Direção elétrica', 'Vidros elétricos', 'Freios ABS']
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1685091955352-4bb8796aef12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    brand: 'Chevrolet',
    model: 'Cruze',
    year: 2020,
    price: 89000,
    mileage: 55000,
    fuel: 'Flex',
    transmission: 'Automático',
    color: 'Prata',
    description: 'Chevrolet Cruze sedan completo. Excelente para o dia a dia.',
    features: ['Ar condicionado', 'Direção elétrica', 'Vidros elétricos', 'Freios ABS']
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1692863211226-cbba732754c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    brand: 'Ford',
    model: 'Fusion',
    year: 2019,
    price: 92000,
    mileage: 68000,
    fuel: 'Gasolina',
    transmission: 'Automático',
    color: 'Azul',
    description: 'Ford Fusion elegante e potente. Motor 2.0 turbo.',
    features: ['Ar condicionado', 'Direção elétrica', 'Vidros elétricos', 'Freios ABS']
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

export function CarsProvider({ children }: { children: ReactNode }) {
  const [cars, setCars] = useState<Car[]>(initialCars);
  const [nextId, setNextId] = useState(10);

  const addCar = (carData: Omit<Car, 'id'>) => {
    const newCar: Car = {
      ...carData,
      id: nextId
    };
    setCars(prev => [newCar, ...prev]);
    setNextId(prev => prev + 1);
  };

  const removeCar = (id: number) => {
    setCars(prev => prev.filter(car => car.id !== id));
  };

  const getCarById = (id: number) => {
    return cars.find(car => car.id === id);
  };

  return (
    <CarsContext.Provider value={{ cars, addCar, removeCar, getCarById }}>
      {children}
    </CarsContext.Provider>
  );
}

export function useCars() {
  const context = useContext(CarsContext);
  if (context === undefined) {
    throw new Error('useCars must be used within a CarsProvider');
  }
  return context;
}
