export const formatCurrency = (amount) => {
  const num = parseFloat(amount);
  if (isNaN(num)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
};

export const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
};

export const getStockBadgeClass = (quantity) => {
  if (quantity === 0) return 'badge-danger';
  if (quantity < 5) return 'badge-warning';
  return 'badge-success';
};
