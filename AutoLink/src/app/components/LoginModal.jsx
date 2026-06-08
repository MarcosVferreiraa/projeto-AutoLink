import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone } from 'lucide-react';

export function LoginModal({ isOpen, onClose, onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({
      name: formData.name || 'Usuário',
      email: formData.email,
      phone: formData.phone
    });
    setFormData({ name: '', email: '', password: '', phone: '' });
    onClose();
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2>{isRegistering ? 'Criar Conta' : 'Entrar'}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isRegistering && (
            <div className="space-y-2">
              <label className="block mb-2 text-sm">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  required={isRegistering}
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block mb-2 text-sm">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                required
                className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
          </div>

          {isRegistering && (
            <div className="space-y-2">
              <label className="block mb-2 text-sm">Telefone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(11) 98765-4321"
                  required={isRegistering}
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block mb-2 text-sm">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-black text-white rounded-md hover:opacity-90 transition-opacity"
          >
            {isRegistering ? 'Criar Conta' : 'Entrar'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-sm text-slate-500 hover:text-slate-950 transition-colors"
            >
              {isRegistering ? 'Já tem uma conta? Entrar' : 'Não tem conta? Criar agora'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
