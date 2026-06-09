import { Calculator, TrendingUp } from 'lucide-react';
import { useState } from 'react';

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
    const monthlyRate = rate;
    const payment = (financed * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);

    return {
      monthlyPayment: payment,
      totalAmount: payment * term + down,
      totalInterest: (payment * term + down) - price,
      financedAmount: financed
    };
  };

  const result = calculateMonthlyPayment();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Calculator className="w-8 h-8 text-primary" />
          <h1>Simulador de Financiamento</h1>
        </div>
        <p className="text-muted-foreground">
          Simule o financiamento do seu veículo e veja as melhores condições
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="mb-6">Dados do Financiamento</h3>

          <div className="space-y-4">
            <div>
              <label className="block mb-2">Valor do Veículo</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                <input
                  type="number"
                  value={carPrice}
                  onChange={(e) => setCarPrice(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-input-background rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2">Entrada</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-input-background rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {((Number(downPayment) / Number(carPrice)) * 100).toFixed(1)}% do valor do veículo
              </p>
            </div>

            <div>
              <label className="block mb-2">Prazo (meses)</label>
              <select
                value={months}
                onChange={(e) => setMonths(e.target.value)}
                className="w-full px-4 py-2 bg-input-background rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="12">12 meses</option>
                <option value="24">24 meses</option>
                <option value="36">36 meses</option>
                <option value="48">48 meses</option>
                <option value="60">60 meses</option>
              </select>
            </div>

            <div>
              <label className="block mb-2">Taxa de Juros (ao mês)</label>
              <input
                type="text"
                value={`${interestRate}%`}
                disabled
                className="w-full px-4 py-2 bg-muted rounded-md border border-border text-muted-foreground"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Taxa promocional autoLink
              </p>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-lg p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5" />
              <h3>Parcela Mensal</h3>
            </div>
            <p className="text-4xl mb-1">
              R$ {result.monthlyPayment.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-primary-foreground/80">
              em {months} vezes
            </p>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <h4 className="mb-4">Resumo do Financiamento</h4>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Valor do Veículo</span>
                <span>R$ {Number(carPrice).toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Entrada</span>
                <span>R$ {Number(downPayment).toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Valor Financiado</span>
                <span>R$ {result.financedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Total de Juros</span>
                <span>R$ {result.totalInterest.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Total a Pagar</span>
                <span className="text-primary">
                  R$ {result.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          <button className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            Solicitar Financiamento
          </button>
        </div>
      </div>
    </div>
  );
}
