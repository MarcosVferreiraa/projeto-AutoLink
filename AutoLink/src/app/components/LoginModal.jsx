 import { X, Shield, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { auth } from "../../firebase/firebase"; // Verifique este caminho!
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import "./LoginModal.css";

export function LoginModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const getFriendlyError = (error) => {
  switch (error.code) {
    case "auth/invalid-credential":
      return "E-mail ou senha incorretos.";

    case "auth/email-already-in-use":
      return "Este e-mail já está cadastrado.";

    case "auth/weak-password":
      return "A senha deve ter pelo menos 6 caracteres.";

    case "auth/invalid-email":
      return "Digite um e-mail válido.";

    case "auth/too-many-requests":
      return "Muitas tentativas. Tente novamente mais tarde.";

    default:
      return "Ocorreu um erro. Tente novamente.";
  }
};

  const handleGoogleLogin = async () => {
  const provider = new GoogleAuthProvider();

  try {
    await signInWithPopup(auth, provider);
    onClose();
  } catch (err) {
    setError(getFriendlyError(err));
  }
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  // Validações personalizadas
  if (isRegistering && !name.trim()) {
    setError("Digite o seu nome.");
    return;
  }

  if (!email.trim()) {
    setError("Digite o seu e-mail.");
    return;
  }

  if (!password.trim()) {
    setError("Digite a sua senha.");
    return;
  }

  if (isRegistering && !confirmPassword.trim()) {
    setError("Confirme a sua senha.");
    return;
  }

  if (isRegistering && !phone.trim()) {
    setError("Digite o seu telefone.");
    return;
  }

  if (isRegistering && password !== confirmPassword) {
    setError("As senhas precisam ser iguais.");
    return;
  }

  try {
    if (isRegistering) {
      await register(name, email, password, phone);
    } else {
      await login(email, password);
    }

    onClose();
  } catch (err) {
    setError(getFriendlyError(err));
  }
};
  const handleToggleMode = () => {
  setIsRegistering((prev) => !prev);
  setError("");
  setName("");
  setPhone("");
  setEmail("");
  setPassword("");
  setConfirmPassword("");
};

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <div className="login-modal-header">
          <h2>{isRegistering ? "Criar Conta" : "Entrar"}</h2>
          <button className="login-modal-close" onClick={onClose}><X /></button>
        </div>

        <form onSubmit={handleSubmit}className="login-modal-form"noValidate>
          {error && (
            <div className="login-alert login-alert-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {isRegistering && (
            <div className="login-modal-group">
              <label className="login-modal-label">Nome</label>
              <input
                type="text"
                className="login-modal-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                
              />
            </div>
          )}

          <div className="login-modal-group">
            <label className="login-modal-label">E-mail</label>
            <input
              type="email" className="login-modal-input"
              value={email} onChange={(e) => setEmail(e.target.value)}
              
            />
          </div>

          <div className="login-modal-group">
            <label className="login-modal-label">Senha</label>
            <input
              type="password" className="login-modal-input"
              value={password} onChange={(e) => setPassword(e.target.value)}
              
            />
          </div>

          {isRegistering && (
            <>
              <div className="login-modal-group">
                <label className="login-modal-label">Confirmar senha</label>
                <input
                  type="password"
                  className="login-modal-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                 
                />
              </div>

              <div className="login-modal-group">
                <label className="login-modal-label">Telefone</label>
                <input
                  type="text"
                  className="login-modal-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                 
                />
              </div>
            </>
          )}

          <button type="submit" className="login-modal-submit">
            {isRegistering ? "Criar Conta" : "Entrar"}
          </button>

          <button
            type="button"
            className="login-modal-switch"
            onClick={handleToggleMode}
          >
            {isRegistering
              ? "Já tem conta? Entrar"
              : "Ainda não tem conta? Criar perfil"}
          </button>
        </form>

        {!isRegistering && (
          <div style={{ padding: "0 1.5rem 1.5rem 1.5rem" }}>
            <div className="login-modal-separator">ou</div>
            <button type="button" className="login-modal-demo-box" onClick={handleGoogleLogin}>
              <Shield className="w-5 h-5" />
              <span>Entrar com Google</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}