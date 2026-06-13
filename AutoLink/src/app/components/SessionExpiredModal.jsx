import { ShieldAlert } from "lucide-react";
import "./SessionExpiredModal.css";

export function SessionExpiredModal({
  isOpen,
  countdown,
}) {
  if (!isOpen) return null;

  return (
    <div className="session-overlay">
      <div className="session-modal">
        <ShieldAlert size={60} />

        <h2>Sessão Expirada</h2>

        <p>
          Por motivos de segurança, faça login
          novamente.
        </p>

        <div className="session-counter">
          {countdown}
        </div>
      </div>
    </div>
  );
}