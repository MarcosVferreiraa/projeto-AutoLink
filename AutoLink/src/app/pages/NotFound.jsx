import { useNavigate } from 'react-router';
import { Home, Search } from 'lucide-react';
import './NotFound.css'; 

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <div className="notfound-icon-wrapper">
          <Search className="notfound-icon" />
        </div>
        <h1>404</h1>
        <h2>Página não encontrada</h2>
        <p className="notfound-description">
          Desculpe, a página que você está procurando não existe ou foi removida.
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn-back-home"
        >
          <Home className="w-4 h-4" />
          Voltar para a Página Inicial
        </button>
      </div>
    </div>
  );
}