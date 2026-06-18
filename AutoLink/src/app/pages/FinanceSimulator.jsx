import { Calculator } from 'lucide-react';
import { useState } from 'react';
import './FinanceSimulator.css';

export function FinanceSimulator() {
  const [carPrice, setCarPrice] = useState('150000');
  const [downPayment, setDownPayment] = useState('30000');
  const [months, setMonths] = useState('48');
  const [interestRate] = useState(1.5);

  const calculateMonthlyPayment = () => {
    const price = Number(carPrice);
    const down = Number(downPayment);
    const term = Number(months);
    const rate = interestRate / 100;
    const financed = price - down;
    const payment = financed > 0 
      ? (financed * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1) 
      : 0;

    return {
      monthlyPayment: payment > 0 ? payment : 0,
      totalAmount: payment > 0 ? (payment * term + down) : price,
      totalInterest: payment > 0 ? ((payment * term + down) - price) : 0,
      financedAmount: financed > 0 ? financed : 0
    };
  };

  const result = calculateMonthlyPayment();

  return (
    <div className="simulator-container">
      <div className="simulator-header">
        <div className="simulator-title-row">
          <Calculator className="w-8 h-8 text-primary" />
          <h1>Simulador de Financiamento</h1>
        </div>
        <p>Calcule o valor aproximado das parcelas para o seu próximo veículo</p>
      </div>

      <div className="simulator-layout">
        {/* COLUNA ESQUERDA: INPUTS */}
        <div className="simulator-card">
          <div className="form-group">
            <label>Valor do Veículo (R$)</label>
            <input type="number" value={carPrice} onChange={(e) => setCarPrice(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Valor de Entrada (R$)</label>
            <input type="number" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Prazo de Pagamento</label>
            <select value={months} onChange={(e) => setMonths(e.target.value)}>
              <option value="12">12 meses</option>
              <option value="24">24 meses</option>
              <option value="36">36 meses</option>
              <option value="48">48 meses</option>
              <option value="60">60 meses</option>
            </select>
          </div>
          <div className="interest-rate-info">
            Taxa de juros: <strong>{interestRate}% ao mês</strong>.
          </div>
        </div>

        {/* COLUNA DIREITA: RESULTADOS */}
        <div className="simulator-results-column">
          <div className="simulator-card results-display-card">
            <p className="payment-label">Parcela Mensal Estimada</p>
            <h2 className="payment-value">R$ {result.monthlyPayment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
            <p className="payment-term">em {months}x fixas</p>
          </div>

          <div className="simulator-card details-breakdown-card">
            <h3>Resumo da Simulação</h3>
            <div className="breakdown-list">
              <div className="breakdown-row"><span className="label-text">Preço do Carro</span><span>R$ {Number(carPrice).toLocaleString('pt-BR')}</span></div>
              <div className="breakdown-row"><span className="label-text">Entrada</span><span>R$ {Number(downPayment).toLocaleString('pt-BR')}</span></div>
              <div className="breakdown-row"><span className="label-text">Valor Financiado</span><span>R$ {result.financedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
              <div className="breakdown-row"><span className="label-text">Total de Juros</span><span>R$ {result.totalInterest.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
              <div className="breakdown-row total-row"><span className="label-text">Total a Pagar</span><span className="value-text">R$ {result.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
            </div>
          </div>

          <button className="btn-request-finance">Solicitar Financiamento</button>
        </div>
      </div>
    </div>
  );
}