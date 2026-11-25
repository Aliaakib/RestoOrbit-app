/**
 * Cross-screen formatting utilities for currency, percentages, initials, and dates.
 */

export function formatCurrency(amount) {
  const numeric = Number(amount || 0);
  const abs = Math.abs(numeric).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return numeric < 0 ? `-$${abs}` : `$${abs}`;
}

export function formatSignedCurrency(amount) {
  const numeric = Number(amount || 0);
  const abs = Math.abs(numeric).toFixed(2);
  if (numeric < 0) return `-$${abs}`;
  return `+$${abs}`;
}

export function getInitials(fullName = '') {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'RO';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
