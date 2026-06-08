import React from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useState } from 'react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <h1>Entre em Contato</h1>
        <p>Estamos aqui para ajudar você a encontrar o carro ideal.</p>
      </section>

      <section className="contact-grid">
        <div className="contact-info">
          <article className="contact-card">
            <div className="contact-card-content">
              <div className="contact-card-icon">
                <Phone />
              </div>
              <div>
                <h3 className="contact-card-title">Telefone</h3>
                <p className="contact-card-text">(11) 98765-4321</p>
                <p className="contact-card-text">(11) 3456-7890</p>
              </div>
            </div>
          </article>

          <article className="contact-card">
            <div className="contact-card-content">
              <div className="contact-card-icon">
                <Mail />
              </div>
              <div>
                <h3 className="contact-card-title">E-mail</h3>
                <p className="contact-card-text">contato@autolink.com.br</p>
                <p className="contact-card-text">vendas@autolink.com.br</p>
              </div>
            </div>
          </article>

          <article className="contact-card">
            <div className="contact-card-content">
              <div className="contact-card-icon">
                <MapPin />
              </div>
              <div>
                <h3 className="contact-card-title">Endereço</h3>
                <p className="contact-card-text">Av. Paulista, 1000</p>
                <p className="contact-card-text">Bela Vista, São Paulo - SP</p>
                <p className="contact-card-text">CEP: 01310-100</p>
              </div>
            </div>
          </article>

          <article className="contact-card">
            <div className="contact-card-content">
              <div className="contact-card-icon">
                <Clock />
              </div>
              <div>
                <h3 className="contact-card-title">Horário de Atendimento</h3>
                <p className="contact-card-text">Segunda a Sexta: 8h - 18h</p>
                <p className="contact-card-text">Sábado: 9h - 14h</p>
                <p className="contact-card-text">Domingo: Fechado</p>
              </div>
            </div>
          </article>
        </div>

        <div className="contact-form-card">
          <div className="contact-form-header">
            <h2>Envie sua Mensagem</h2>
            <p>Preencha o formulário abaixo e nossa equipe retornará em breve.</p>
          </div>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row form-row-cols-2">
              <label className="form-field-label">
                Nome Completo
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-field"
                />
              </label>

              <label className="form-field-label">
                E-mail
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-field"
                />
              </label>
            </div>

            <div className="form-row form-row-cols-2">
              <label className="form-field-label">
                Telefone
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="form-field"
                />
              </label>

              <label className="form-field-label">
                Assunto
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="form-field"
                >
                  <option value="">Selecione...</option>
                  <option value="info">Informações sobre veículos</option>
                  <option value="financing">Financiamento</option>
                  <option value="proposal">Fazer uma proposta</option>
                  <option value="other">Outros</option>
                </select>
              </label>
            </div>

            <label className="form-field-label">
              Mensagem
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="form-field form-textarea"
              />
            </label>

            <button type="submit" className="contact-button">
              Enviar mensagem
              <Send className="button-icon" />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}