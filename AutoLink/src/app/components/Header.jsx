import { Link } from "react-router";
import {
  Phone,
  Mail,
  User,
  LogIn,
  Shield,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { formatPhoneByThreeDigits } from "../utils/phone";

import "./Header.css";

export function Header({
  onLoginClick,
  onProfileClick,
  onOpenAddCar,
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
              <img src="/favicon.svg" alt="AutoLink" className="header-logo-image" />
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
                <span>{formatPhoneByThreeDigits("910214376")}</span>
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