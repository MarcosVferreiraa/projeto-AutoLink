import './ConfirmModal.css';

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message
}) {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay" onClick={onClose}>
      <div
        className="confirm-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>{title}</h3>

        <p>{message}</p>

        <div className="confirm-modal-actions">
          <button
            className="confirm-btn confirm-btn-cancel"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className="confirm-btn confirm-btn-danger"
            onClick={onConfirm}
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}