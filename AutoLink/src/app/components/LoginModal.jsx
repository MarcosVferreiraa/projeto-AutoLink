import { X, Mail, Lock, User, Phone, Shield } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './LoginModal.css';

export function LoginModal({ isOpen, onClose }) {
  const { login } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isRegistering) {
      // Registration: create as a regular user session
      const result = login('joao@email.com', 'user123');
      if (result.success) {
        setFormData({ name: '', email: '', password: '', phone: '' });
        onClose();
      }
      return;
    }

    const result = login(formData.email, formData.password);
    if (result.success) {
      setFormData({ name: '', email: '', password: '', phone: '' });
      onClose();
    } else {
      setError(result.error || 'Erro ao fazer login');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleClose = () => {
    setFormData({ name: '', email: '', password: '', phone: '' });
    setError('');
    setIsRegistering(false);
    onClose();
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <div className="login-modal-header">
          <h2>{isRegistering ? 'Criar Conta' : 'Entrar'}</h2>
          <button onClick={handleClose} className="login-modal-close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-modal-form">
          {isRegistering && (
            <div>
              <label className="login-modal-label">Nome Completo</label>
              <div className="login-modal-group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  required={isRegistering}
                  className="login-modal-input"
                />
              </div>
            </div>
          )}

          <div>
            <label className="login-modal-label">E-mail</label>
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
              <label className="login-modal-label">Telefone</label>
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

          <div>
            <label className="login-modal-label">Senha</label>
            <div className="login-modal-group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="login-modal-input"
              />
            </div>
          </div>

          {error && (
            <p className="login-modal-error">{error}</p>
          )}

          <button
            type="submit"
            className="login-modal-submit"
          >
            {isRegistering ? 'Criar Conta' : 'Entrar'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
              className="login-modal-toggle"
            >
              {isRegistering ? 'Já tem uma conta? Entrar' : 'Não tem conta? Criar agora'}
            </button>
          </div>
        </form>

        {!isRegistering && (
          <div className="login-modal-demo">
            <div className="login-modal-demo-box">
              <div className="login-modal-demo-header">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <p className="login-modal-demo-text">Contas de demonstração:</p>
              </div>
              <div className="login-modal-demo-text">
                <p><span className="login-modal-demo-strong">Usuário:</span> joao@email.com / user123</p>
                <p><span className="login-modal-demo-strong">Admin:</span> admin@autolink.com / admin123</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
