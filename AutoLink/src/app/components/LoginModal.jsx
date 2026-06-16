import { X, Mail, Lock, User, Phone, Shield } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./LoginModal.css";

export function LoginModal({ isOpen, onClose }) {
  const { login, register } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user", 
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

 const handleClose = () => {
  setFormData({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
  });

  setError("");
  setIsRegistering(false);
  onClose();
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      if (isRegistering) {
        await register(
          formData.name,
          formData.email,
          formData.password,
          formData.phone,
          formData.role,
        );

        handleClose();
        return;
      }

      await login(
        formData.email,
        formData.password
      );

      handleClose();

    } catch (error) {
      console.error(error);

      switch (error?.code) {
        case "auth/email-already-in-use":
          setError("Este e-mail já está cadastrado.");
          break;

        case "auth/weak-password":
          setError(
            "A senha deve ter pelo menos 6 caracteres."
          );
          break;

        case "auth/invalid-email":
          setError("E-mail inválido.");
          break;

        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
          setError("E-mail ou senha incorretos.");
          break;

        case "auth/operation-not-allowed":
          setError(
            "Login por e-mail/senha não está habilitado no Firebase."
          );
          break;

        default:
          setError(
            error?.message ||
              "Ocorreu um erro inesperado."
          );
      }
    }
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">

        <div className="login-modal-header">
          <h2>
            {isRegistering
              ? "Criar Conta"
              : "Entrar"}
          </h2>

          <button
            onClick={handleClose}
            className="login-modal-close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="login-modal-form"
        >

          {isRegistering && (
            <div>
              <label className="login-modal-label">
                Nome Completo
              </label>

              <div className="login-modal-group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  required
                  className="login-modal-input"
                />
              </div>
            </div>
          )}

          <div>
            <label className="login-modal-label">
              E-mail
            </label>

            <div className="login-modal-group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                required
                className="login-modal-input"
              />
            </div>
          </div>

          {isRegistering && (
            <div>
              <label className="login-modal-label">
                Telefone
              </label>

              <div className="login-modal-group">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(11) 98765-4321"
                  className="login-modal-input"
                />
              </div>
            </div>
          )}

          {isRegistering && (
  <div>
    <label className="login-modal-label">
      Tipo de Conta
    </label>

    <div className="login-modal-group">
      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="login-modal-input"
      >
        <option value="user">
          Utilizador
        </option>

        <option value="pending_admin">
          Solicitar Administrador
        </option>
      </select>
    </div>
      {formData.role === "pending_admin" && (
      <p className="text-sm text-yellow-600 mt-2">
        A sua conta precisará ser aprovada por um administrador.
      </p>
    )}
  </div>
)}


          <div>
            <label className="login-modal-label">
              Senha
            </label>

            <div className="login-modal-group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={6}
                className="login-modal-input"
              />
            </div>
          </div>

          {error && (
            <p className="login-modal-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-modal-submit"
          >
            {isRegistering
              ? "Criar Conta"
              : "Entrar"}
          </button>

          <div className="text-center">
            <button
              type="button"
              className="login-modal-toggle"
              onClick={() => {
                setIsRegistering(
                  !isRegistering
                );
                setError("");
              }}
            >
              {isRegistering
                ? "Já tem uma conta? Entrar"
                : "Não tem conta? Criar agora"}
            </button>
          </div>

        </form>

        {!isRegistering && (
          <div className="login-modal-demo">
            <div className="login-modal-demo-box">
              <div className="login-modal-demo-header">
                <Shield className="w-4 h-4 text-muted-foreground" />

                <p className="login-modal-demo-text">
                  Login com Firebase
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}