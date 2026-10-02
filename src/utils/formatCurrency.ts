/**
 * Format a numeric amount to Indian Rupee string (₹)
 * Example: 6999 -> "₹6,999"
 */
export const formatINR = (amount: number): string => {
  if (isNaN(amount)) return '₹0';
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
};
