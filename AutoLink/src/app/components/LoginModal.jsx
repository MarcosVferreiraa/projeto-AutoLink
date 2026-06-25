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
  const [birthDate, setBirthDate] = useState("");
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
        return "A senha deve ter pelo menos 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial.";

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

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();

    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const cleanName = name.trim();
    if (!email.trim()) {
      setError("Digite o seu e-mail.");
      return;
    }

    if (!password.trim()) {
      setError("Digite a sua senha.");
      return;
    }

    if (isRegistering) {

      if (!cleanName) {
        setError("Digite o seu nome.");
        return;
      }

      if (cleanName.length < 3) {
        setError("O nome deve ter pelo menos 3 letras.");
        return;
      }

      if (!/^[A-Za-zÀ-ÿ\s]+$/.test(cleanName)) {
        setError("O nome deve conter apenas letras.");
        return;
      }

      const phoneNumbers = phone.replace(/\D/g, "");

      if (phoneNumbers.length < 9) {
        setError("Digite um telefone válido.");
        return;
      }
      if (!birthDate) {
        setError("Informe sua data de nascimento.");
        return;
      }

      const age = calculateAge(birthDate);

      if (age < 18 || age > 120) {
        setError(
          "A idade derivada da data de nascimento deve estar entre 18 e 120 anos."
        );
        return;
      }

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/;

      if (!passwordRegex.test(password)) {
        setError(
          "A senha deve ter pelo menos 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial."
        );
        return;
      }
    }

    if (isRegistering && password !== confirmPassword) {
      setError("As senhas precisam ser iguais.");
      return;
    }

    try {
      if (isRegistering) {
        await register(cleanName, email, password, phone, birthDate);
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
    setBirthDate("");
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <div className="login-modal-header">
          <h2>{isRegistering ? "Criar Conta" : "Entrar"}</h2>
          <button className="login-modal-close" onClick={onClose}><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="login-modal-form" noValidate>
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
                onChange={(e) =>
                  setName(e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, ""))}

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
                  type="tel"
                  className="login-modal-input"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, ""))
                  }
                  maxLength={9}
                />

              </div>

              <div className="login-modal-group">
                <label className="login-modal-label">Data de nascimento</label>
                <input
                  type="date"
                  className="login-modal-input"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  min={new Date(
                    new Date().setFullYear(new Date().getFullYear() - 120)
                  ).toISOString().split("T")[0]}
                  max={new Date(
                    new Date().setFullYear(new Date().getFullYear() - 18)
                  ).toISOString().split("T")[0]}
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