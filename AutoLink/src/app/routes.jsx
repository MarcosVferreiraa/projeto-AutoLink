import { createBrowserRouter } from 'react-router';
import { Root } from './pages/Root';
import { Home } from './pages/Home';
import { CarDetails } from './pages/CarDetails';
import { Favorites } from './pages/Favorites';
import { MyProposals } from './pages/MyProposals';
import { FinanceSimulator } from './pages/FinanceSimulator';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { NotFound } from './pages/NotFound';
import { AdminProposals } from './pages/AdminProposals';
import { AdminUsers } from './pages/AdminUsers'; // ← 1. Importação da nova página

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'carro/:id', Component: CarDetails },
      { path: 'favoritos', Component: Favorites },
      { path: 'propostas', Component: MyProposals },
      { path: 'financiamento', Component: FinanceSimulator },
      { path: 'sobre', Component: About },
      { path: 'contato', Component: Contact },
      { path: 'admin/propostas', Component: AdminProposals },
      { path: 'admin/usuarios', Component: AdminUsers }, // ← 2. Rota alinhada com o padrão Component
      { path: '*', Component: NotFound }
    ]
  }
]);