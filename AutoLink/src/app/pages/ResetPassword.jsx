import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ResetPassword.css';

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const { completePasswordReset } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = searchParams.get('token') || '';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      setIsSubmitting(true);
      await completePasswordReset(token, password);
      setIsComplete(true);
    } catch (requestError) {
      setError(requestError.code === 'auth/invalid-reset-token'
        ? 'Este link é inválido ou expirou. Solicite outro link de recuperação.'
        : 'Não foi possível redefinir a senha. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="reset-password-page">
      <section className="reset-password-card">
        <h1>Redefinir senha</h1>

        {!token ? (
          <>
            <p className="reset-password-message reset-password-error">
              O link de redefinição está ausente ou inválido.
            </p>
            <Link to="/login">Voltar ao login</Link>
          </>
        ) : isComplete ? (
          <>
            <p className="reset-password-message reset-password-success">
              Senha alterada. Agora você já pode entrar na sua conta.
            </p>
            <Link to="/login">Ir para o login</Link>
          </>
        ) : (
          <form className="reset-password-form" onSubmit={handleSubmit}>
            <label className="reset-password-field">
              <span>Nova senha</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                minLength={6}
                required
              />
            </label>

            <label className="reset-password-field">
              <span>Confirmar nova senha</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                minLength={6}
                required
              />
            </label>

            {error && <p className="reset-password-message reset-password-error" role="alert">{error}</p>}

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar nova senha'}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}