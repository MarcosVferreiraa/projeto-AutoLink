import { X, Shield } from "lucide-react";
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

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onClose(); 
    } catch (err) {
      setError("Erro: " + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
      setError(err.message);
    }
  };

  const handleToggleMode = () => {
    setIsRegistering((prev) => !prev);
    setError("");
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <div className="login-modal-header">
          <h2>{isRegistering ? "Criar Conta" : "Entrar"}</h2>
          <button className="login-modal-close" onClick={onClose}><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="login-modal-form">
          {error && <p className="login-modal-error">{error}</p>}

          {isRegistering && (
            <div className="login-modal-group">
              <label className="login-modal-label">Nome</label>
              <input
                type="text"
                className="login-modal-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isRegistering}
              />
            </div>
          )}

          <div className="login-modal-group">
            <label className="login-modal-label">E-mail</label>
            <input 
              type="email" className="login-modal-input" 
              value={email} onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="login-modal-group">
            <label className="login-modal-label">Senha</label>
            <input 
              type="password" className="login-modal-input" 
              value={password} onChange={(e) => setPassword(e.target.value)}
              required
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
                  required={isRegistering}
                />
              </div>

              <div className="login-modal-group">
                <label className="login-modal-label">Telefone</label>
                <input
                  type="text"
                  className="login-modal-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required={isRegistering}
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