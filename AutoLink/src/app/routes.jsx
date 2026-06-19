import { createBrowserRouter } from 'react-router-dom';
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
import { AdminUsers } from './pages/AdminUsers'; 
import { EditCar } from './pages/EditCar';  
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'carro/:id', Component: CarDetails },
      { path: 'carro/:id/editar', element: <ProtectedRoute><EditCar /></ProtectedRoute> },
      { path: 'favoritos', element: <ProtectedRoute><Favorites /></ProtectedRoute> },
      { path: 'propostas', element: <ProtectedRoute><MyProposals /></ProtectedRoute> },
      { path: 'financiamento', Component: FinanceSimulator },
      { path: 'login', Component: Home },
      { path: 'sobre', Component: About },
      { path: 'contato', Component: Contact },
      { path: 'admin/propostas', element: <AdminRoute><AdminProposals /></AdminRoute> },
      { path: 'admin/usuarios', element: <AdminRoute><AdminUsers /></AdminRoute> }, 
      { path: '*', Component: NotFound }
    ]
  }
]);