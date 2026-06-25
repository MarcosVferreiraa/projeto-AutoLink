import { useState } from "react";
import "./ConfirmModal.css";

export function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
}) {
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(password);
    setPassword("");
  };

  return (
    <div
      className="confirm-modal-overlay"
      onClick={onClose}
    >
      <div
        className="confirm-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Excluir Conta</h3>

        <p>
          Esta ação é permanente e não pode ser desfeita.
        </p>

        <input
          type="password"
          className="confirm-modal-input"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <div className="confirm-modal-actions">
          <button
            className="confirm-btn confirm-btn-cancel"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className="confirm-btn confirm-btn-danger"
            onClick={handleConfirm}
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}