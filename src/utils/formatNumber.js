export const formatNumber = (n) => new Intl.NumberFormat('en-IN').format(n);
export const formatCurrency = (n) => `₹${formatNumber(n)}`;
export const formatPercent = (n) => `${n}%`;
