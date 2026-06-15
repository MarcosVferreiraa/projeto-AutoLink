import { ShieldAlert, LogIn } from "lucide-react";
import "./SessionExpiredModal.css";

export function SessionExpiredModal({ isOpen, countdown, onLogin }) {
  if (!isOpen) return null;

  return (
    <div className="session-overlay">
      <div className="session-modal">
        <ShieldAlert size={64} className="session-icon" />

        <h2>Sessão Expirada</h2>

        <p>
          Por motivos de segurança, sua sessão expirou.<br />
          Faça login novamente para continuar.
        </p>

        <div className="session-counter">
          {countdown}
        </div>

        <button onClick={onLogin} className="session-login-btn">
          <LogIn size={20} />
          Fazer Login Novamente
        </button>
      </div>
    </div>
  );
}