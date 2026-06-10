import { Link } from "react-router";
import {
  X,
  User,
  Mail,
  Phone,
  Heart,
  Car,
  LogOut,
  Shield,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { useProposals } from "../context/ProposalsContext";

import "./ProfileModal.css";

export function ProfileModal({
  isOpen,
  onClose,
}) {
  const {
    user,
    userProfile,
    logout,
    isAdmin,
  } = useAuth();

  const { favoriteIds } = useFavorites();
  const { getUserProposals } =
    useProposals();

  if (!isOpen || !user) return null;

  const userProposals =
    getUserProposals?.(user.uid) || [];

  const handleLogout = async () => {
  try {
    await logout();
    onClose();
  } catch (error) {
    console.error(error);
  }
};

  const displayName =
    userProfile?.name ||
    user?.displayName ||
    "Usuário";

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal-panel">
        <div className="profile-modal-header">
          <h2>Meu Perfil</h2>

          <button
            onClick={onClose}
            className="profile-modal-close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="profile-modal-content">

          <div className="profile-modal-banner">
            <div className="profile-modal-banner-row">

              <div className="profile-modal-avatar">
                {isAdmin ? (
                  <Shield className="w-8 h-8" />
                ) : (
                  <User className="w-8 h-8" />
                )}
              </div>

              <div>
                <h3 className="profile-modal-name">
                  {displayName}
                </h3>

                <p className="profile-modal-role">
                  {isAdmin
                    ? "Administrador"
                    : "Cliente"}
                </p>
              </div>

            </div>
          </div>

          <div className="profile-modal-section">
            <h3 className="profile-modal-section-title">
              Informações de Contato
            </h3>

            <div className="space-y-3">

              <div className="profile-modal-contact-card">
                <Mail className="w-5 h-5 text-muted-foreground" />

                <div>
                  <p className="profile-modal-contact-label">
                    E-mail
                  </p>

                  <p>{user.email}</p>
                </div>
              </div>

              <div className="profile-modal-contact-card">
                <Phone className="w-5 h-5 text-muted-foreground" />

                <div>
                  <p className="profile-modal-contact-label">
                    Telefone
                  </p>

                  <p>
                    {userProfile?.phone ||
                      "Não informado"}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {!isAdmin && (
            <div className="profile-modal-grid">

              <Link
                to="/favoritos"
                onClick={onClose}
                className="profile-modal-card-link"
              >
                <Heart className="profile-modal-card-link-icon text-destructive" />

                <p className="profile-modal-card-link-meta">
                  {favoriteIds.length}
                </p>

                <p className="profile-modal-card-link-text">
                  Favoritos
                </p>
              </Link>

              <Link
                to="/propostas"
                onClick={onClose}
                className="profile-modal-card-link"
              >
                <Car className="profile-modal-card-link-icon text-primary" />

                <p className="profile-modal-card-link-meta">
                  {userProposals.length}
                </p>

                <p className="profile-modal-card-link-text">
                  Propostas
                </p>
              </Link>

            </div>
          )}

          <div className="profile-modal-link-list">

            <Link
              to="/favoritos"
              onClick={onClose}
              className="profile-modal-link-item"
            >
              <Heart className="w-5 h-5 text-muted-foreground" />
              <span>Carros Favoritos</span>
            </Link>

            {!isAdmin && (
              <Link
                to="/propostas"
                onClick={onClose}
                className="profile-modal-link-item"
              >
                <Car className="w-5 h-5 text-muted-foreground" />
                <span>Minhas Propostas</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin/propostas"
                onClick={onClose}
                className="profile-modal-link-item"
              >
                <Shield className="w-5 h-5 text-muted-foreground" />
                <span>
                  Gerenciar Propostas
                </span>
              </Link>
            )}

          </div>

          <button
            onClick={handleLogout}
            className="profile-modal-logout"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair da Conta</span>
          </button>

        </div>
      </div>
    </div>
  );
}