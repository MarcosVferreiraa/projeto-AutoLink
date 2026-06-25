import { Link } from "react-router";
import { useEffect, useState } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Heart,
  Car,
  LogOut,
  Shield,
  Trash2,
  CheckCircle,
  AlertCircle
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { useProposals } from "../context/ProposalsContext";
import { formatPhoneByThreeDigits } from "../utils/phone";
import { DeleteAccountModal } from "./DeleteAccountModal";

import "./ProfileModal.css";

export function ProfileModal({
  isOpen,
  onClose,
}) {
  const {
    user,
    userProfile,
    updateProfile,
    changePassword,
    canChangePassword,
    logout,
    deleteAccount,
    isAdmin,
  } = useAuth();

  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveMessage, setProfileSaveMessage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSaveMessage, setPasswordSaveMessage] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const { favoriteIds } = useFavorites();
  const proposalsContext =
    useProposals();
  const getUserProposals =
    proposalsContext?.getUserProposals;

  useEffect(() => {
    if (!isOpen || !user) return;

    setProfileName(userProfile?.name || user?.displayName || "");
    setProfilePhone(
      formatPhoneByThreeDigits(
        userProfile?.phone || userProfile?.phoneNumber || ""
      )
    );

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordSaveMessage("");
  }, [isOpen, userProfile, user]);

  if (!isOpen || !user) return null;

  const userProposals =
    getUserProposals?.(user.uid || user.id) || [];

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      alert("Digite a sua senha para confirmar.");
      return;
    }

    const confirmed = window.confirm(
      "Tem certeza que deseja apagar permanentemente a sua conta?"
    );

    if (!confirmed) return;

    try {
      setIsDeletingAccount(true);

      await deleteAccount(deletePassword);

      onClose();
    } catch (error) {
      console.error(error);

      if (error.code === "auth/wrong-password") {
        alert("Senha incorreta.");
      } else {
        alert("Não foi possível apagar a conta.");
      }
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    if (!profileName.trim()) {
      setProfileSaveMessage("Informe um nome válido.");
      return;
    }

    try {
      setIsSavingProfile(true);
      setProfileSaveMessage("");

      await updateProfile({
        name: profileName,
        phone: formatPhoneByThreeDigits(profilePhone),
      });

      setProfileSaveMessage("Perfil atualizado com sucesso.");
    } catch (error) {
      console.error(error);
      setProfileSaveMessage("Não foi possível atualizar o perfil agora.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordSaveMessage("Preencha todos os campos de senha.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordSaveMessage("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordSaveMessage("A confirmação da senha não coincide.");
      return;
    }

    try {
      setIsChangingPassword(true);
      setPasswordSaveMessage("");
      await changePassword(currentPassword, newPassword);
      setPasswordSaveMessage("Senha atualizada com sucesso.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      setPasswordSaveMessage(error?.message || "Não foi possível alterar a senha agora.");
    } finally {
      setIsChangingPassword(false);
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
                    {formatPhoneByThreeDigits(userProfile?.phone || userProfile?.phoneNumber || "") ||
                      "Não informado"}
                  </p>
                </div>
              </div>

            </div>
          </div>

          <div className="profile-modal-section">
            <h3 className="profile-modal-section-title">
              Editar Perfil
            </h3>

            <form className="profile-modal-edit-form" onSubmit={handleSaveProfile}>
              <label htmlFor="profile-name">Nome</label>
              <input
                id="profile-name"
                type="text"
                value={profileName}
                onChange={(event) => setProfileName(event.target.value)}
                placeholder="Seu nome"
                required
              />

              <label htmlFor="profile-phone">Telefone</label>
              <input
                id="profile-phone"
                type="text"
                value={profilePhone}
                onChange={(event) => setProfilePhone(formatPhoneByThreeDigits(event.target.value))}
                placeholder="912 345 678"
              />

              {profileSaveMessage && (
                <div
                  className={`profile-alert ${profileSaveMessage.includes("sucesso")
                    ? "profile-alert-success"
                    : "profile-alert-error"
                    }`}
                >
                  {profileSaveMessage.includes("sucesso") ? (
                    <CheckCircle size={18} />
                  ) : (
                    <AlertCircle size={18} />
                  )}

                  <span>{profileSaveMessage}</span>
                </div>
              )}

              <button type="submit" className="profile-modal-edit-submit" disabled={isSavingProfile}>
                {isSavingProfile ? "A guardar..." : "Guardar Perfil"}
              </button>
            </form>
          </div>

          <div className="profile-modal-section">
            <h3 className="profile-modal-section-title">
              Alterar Senha
            </h3>

            {canChangePassword ? (
              <form className="profile-modal-edit-form" onSubmit={handleChangePassword}>
                <label htmlFor="profile-current-password">Senha atual</label>
                <input
                  id="profile-current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  placeholder="Digite a senha atual"

                />

                <label htmlFor="profile-new-password">Nova senha</label>
                <input
                  id="profile-new-password"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Mínimo 6 caracteres"

                />

                <label htmlFor="profile-confirm-password">Confirmar nova senha</label>
                <input
                  id="profile-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Repita a nova senha"

                />

                {passwordSaveMessage && (
                  <div
                    className={`profile-alert ${passwordSaveMessage.includes("sucesso")
                      ? "profile-alert-success"
                      : "profile-alert-error"
                      }`}
                  >
                    {passwordSaveMessage}
                  </div>
                )}

                <button type="submit" className="profile-modal-edit-submit" disabled={isChangingPassword}>
                  {isChangingPassword ? "A atualizar..." : "Atualizar Senha"}
                </button>
              </form>
            ) : (
              <p className="profile-modal-edit-feedback">
                Alteração de senha disponível apenas para contas com login por e-mail e senha.
              </p>
            )}
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
            onClick={() => setShowDeleteModal(true)}
            className="profile-modal-delete-account"
          >
            Excluir Conta
          </button>
          <DeleteAccountModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={async (password) => {
              try {
                await deleteAccount(password);
                onClose();
              } catch (error) {
                console.error(error);
                alert("Senha incorreta ou sessão expirada.");
              }
            }}
          />
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