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
    try {
      if (isRegistering) await register(email, password);
      else await login(email, password);
      onClose();
    } catch (err) {
      setError(err.message);
    }
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
          
          <button type="submit" className="login-modal-submit">
            {isRegistering ? "Criar Conta" : "Entrar"}
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