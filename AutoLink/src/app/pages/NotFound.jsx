import { useNavigate } from 'react-router';
import { Home, Search } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-6">
          <Search className="w-24 h-24 mx-auto text-muted-foreground" />
        </div>
        <h1 className="text-6xl mb-4">404</h1>
        <h2 className="text-2xl mb-4">Página não encontrada</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          Desculpe, a página que você está procurando não existe ou foi removida.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          <Home className="w-4 h-4" />
          Voltar para a Página Inicial
        </button>
      </div>
    </div>
  );
}
