import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Impede que o utilizador seja redirecionado por engano enquanto o Firebase carrega
  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>A carregar sessão...</div>;
  }

  // Se não houver utilizador logado, bloqueia e manda para o login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}