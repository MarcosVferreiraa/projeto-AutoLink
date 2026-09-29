const euroFormatter = new Intl.NumberFormat('pt-PT', {
  style: 'currency',
  currency: 'EUR'
});

export const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return euroFormatter.format(Number.isFinite(amount) ? amount : 0);
};