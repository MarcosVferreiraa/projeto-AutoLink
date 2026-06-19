import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useState } from 'react';
import { formatPhoneByThreeDigits } from '../utils/phone';
import './Contact.css';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Mensagem enviada com sucesso!');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Entre em Contato</h1>
        <p>Estamos aqui para ajudar você a encontrar o carro ideal</p>
      </div>

      <div className="contact-layout">
        {/* COLUNA ESQUERDA */}
        <div className="contact-info-sidebar">
          <div className="info-card">
            <div className="info-icon-wrapper"><Phone className="w-5 h-5" /></div>
            <div className="info-content">
              <h3>Telefone</h3>
              <p>{formatPhoneByThreeDigits('910214376')}</p>
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon-wrapper"><Mail className="w-5 h-5" /></div>
            <div className="info-content">
              <h3>Email</h3>
              <p>contato@autolink.com.br</p>
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon-wrapper"><MapPin className="w-5 h-5" /></div>
            <div className="info-content">
              <h3>Localização</h3>
              <p>Av. Paulista, 1000 - São Paulo, SP</p>
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon-wrapper"><Clock className="w-5 h-5" /></div>
            <div className="info-content">
              <h3>Horário</h3>
              <p>Seg-Sex: 08h - 18h</p>
            </div>
          </div>
        </div>
        
        {/* COLUNA DIREITA */}
        <div className="contact-form-wrapper">
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label>Nome</label>
              <input name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-field">
              <label>Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-field">
              <label>Telefone</label>
              <input name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label>Assunto</label>
              <select name="subject" value={formData.subject} onChange={handleChange} required>
                <option value="">Selecione...</option>
                <option value="info">Informações</option>
                <option value="financing">Financiamento</option>
                <option value="other">Outros</option>
              </select>
            </div>
            <div className="form-field">
              <label>Mensagem</label>
              <textarea name="message" value={formData.message} onChange={handleChange} required rows={4} />
            </div>
            <button type="submit" className="btn-submit-contact">
              <Send className="w-4 h-4" /> Enviar Mensagem
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}