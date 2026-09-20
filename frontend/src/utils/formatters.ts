/**
 * Formats a number into South African Rand currency string, rounded to the
 * nearest Rand — no cents shown, ever. Also protects against floating-point
 * artifacts from upstream math (e.g. 1339.3299999999999) leaking into the UI.
 * Example: 2399.95 -> "R2 400" or 1999 -> "R1 999"
 */
export const formatPrice = (price: number): string => {
  const rounded = Math.round(price);
  return `R${rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}`;
};
