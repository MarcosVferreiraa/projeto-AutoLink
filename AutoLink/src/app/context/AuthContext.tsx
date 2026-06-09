import { createContext, useContext, useState, ReactNode } from 'react';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isAdmin: boolean;
}

const MOCK_USERS = [
  { id: 1, name: 'Administrador', email: 'admin@autolink.com', password: 'admin123', phone: '(11) 98765-4321', role: 'admin' as const },
  { id: 2, name: 'João Silva', email: 'joao@email.com', password: 'user123', phone: '(11) 91234-5678', role: 'user' as const },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _pw, ...userData } = found;
      setUser(userData);
      return { success: true };
    }
    return { success: false, error: 'E-mail ou senha incorretos' };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
