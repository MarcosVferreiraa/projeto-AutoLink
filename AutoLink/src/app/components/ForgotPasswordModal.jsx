import { useState } from "react";
import { X, AlertCircle } from "lucide-react";

export function ForgotPasswordModal({
  isOpen,
  onClose,
  resetPassword,
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setInfo("");

    if (!email.trim()) {
      setError("Digite o seu e-mail.");
      return;
    }

    try {
      await resetPassword(email);

      setInfo(
        "Se o e-mail estiver cadastrado, enviamos um link para redefinir a senha."
      );
    } catch (err) {
      setError("Não foi possível enviar o e-mail de recuperação.");
    }
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <div className="login-modal-header">
          <h2>Recuperar Senha</h2>

          <button
            className="login-modal-close"
            onClick={onClose}
          >
            <X />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="login-modal-form"
        >
          {info && (
            <div className="login-alert login-alert-info">
              <AlertCircle size={18} />
              <span>{info}</span>
            </div>
          )}

          {error && (
            <div className="login-alert login-alert-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="login-modal-group">
            <label className="login-modal-label">
              E-mail
            </label>

            <input
              type="email"
              className="login-modal-input"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Digite seu e-mail"
            />
          </div>

          <button
            type="submit"
            className="login-modal-submit"
          >
            Enviar link de recuperação
          </button>
        </form>
      </div>
    </div>
  );
}