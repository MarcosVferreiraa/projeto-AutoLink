import { Link } from "react-router";
import {
  Car,
  Phone,
  Mail,
  User,
  LogIn,
  Shield,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import "./Header.css";

export function Header({
  onLoginClick,
  onProfileClick,
}) {
  const {
    user,
    userProfile,
    isAdmin,
  } = useAuth();

  const displayName =
    userProfile?.name ||
    user?.displayName ||
    user?.email ||
    "Usuário";

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-row">

          <Link
            to="/"
            className="header-brand"
          >
            <div className="header-logo">
              <Car className="w-6 h-6 text-primary-foreground" />
            </div>

            <div className="header-title">
              <h1>autoLink</h1>
              <p>Carros Seminovos</p>
            </div>
          </Link>

          <nav className="header-nav">
            <Link
              to="/"
              className="header-link"
            >
              Início
            </Link>

            <Link
              to="/favoritos"
              className="header-link"
            >
              Favoritos
            </Link>

            {user && !isAdmin && (
              <Link
                to="/propostas"
                className="header-link"
              >
                Minhas Propostas
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin/propostas"
                className="header-admin-link"
              >
                <Shield className="w-4 h-4" />
                Painel Admin
              </Link>
            )}

            <Link
              to="/financiamento"
              className="header-link"
            >
              Financiamento
            </Link>

            <Link
              to="/sobre"
              className="header-link"
            >
              Sobre
            </Link>

            <Link
              to="/contato"
              className="header-link"
            >
              Contato
            </Link>
          </nav>

          <div className="header-contact">

            <div className="header-contact-group">

              <div className="header-contact-item">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>(11) 98765-4321</span>
              </div>

              <div className="header-contact-item">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>
                  contato@autolink.com.br
                </span>
              </div>

            </div>

            {user ? (
              <button
                onClick={onProfileClick}
                className="header-button"
              >
                {isAdmin ? (
                  <Shield className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}

                <span>
                  {displayName.split(" ")[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={onLoginClick}
                className="header-button"
              >
                <LogIn className="w-4 h-4" />
                <span>Entrar</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}