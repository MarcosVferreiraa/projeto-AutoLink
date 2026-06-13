import React, {useState,useEffect} from "react";
import { Outlet } from "react-router";
import { Header } from '../components/Header';
import { LoginModal } from '../components/LoginModal';
import { ProfileModal } from '../components/ProfileModal';
import { useAuth } from '../context/AuthContext';
export function Root() {
  const {user,sessionExpired,} = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  useEffect(() => {
    if (!user && sessionExpired) {
      setIsLoginModalOpen(true);
    }
  }, [user, sessionExpired]);
  
  return <div className="min-h-screen bg-background"><Header onLoginClick={() => setIsLoginModalOpen(true)} onProfileClick={() => setIsProfileModalOpen(true)} /><LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />{user && <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />}<Outlet />{/* Footer */}<footer className="bg-card border-t border-border mt-16"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div className="grid grid-cols-1 md:grid-cols-4 gap-8"><div><h3 className="mb-4">AutoLink</h3><p className="text-muted-foreground">Sua loja de confiança para carros seminovos de qualidade.</p></div><div><h4 className="mb-4">Links Rápidos</h4><ul className="space-y-2 text-muted-foreground"><li><a href="/sobre" className="hover:text-foreground">Sobre Nós</a></li><li><a href="#" className="hover:text-foreground">Como Comprar</a></li><li><a href="/financiamento" className="hover:text-foreground">Financiamento</a></li><li><a href="#" className="hover:text-foreground">Garantia</a></li></ul></div><div><h4 className="mb-4">Atendimento</h4><ul className="space-y-2 text-muted-foreground"><li>Segunda a Sexta: 8h - 18h</li><li>Sábado: 9h - 14h</li><li>(11) 98765-4321</li><li>contato@autolink.com.br</li></ul></div><div><h4 className="mb-4">Localização</h4><p className="text-muted-foreground">Av. Paulista, 1000<br />São Paulo - SP<br />CEP: 01310-100</p></div></div><div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground"><p>© 2026 AutoLink. Todos os direitos reservados.</p></div></div></footer></div>;
}