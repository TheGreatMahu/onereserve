import { CURRENCY } from "./constants";

/**
 * Format a price with BDT taka symbol.
 */
export const formatPrice = (amount, opts = {}) => {
  const { showDecimal = false, compact = false } = opts;
  if (amount === null || amount === undefined) return `${CURRENCY}0`;

  if (compact && amount >= 1000) {
    return `${CURRENCY}${(amount / 1000).toFixed(1)}k`;
  }

  const num = showDecimal
    ? Number(amount).toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : Number(amount).toLocaleString("en-BD");

  return `${CURRENCY}${num}`;
};

/**
 * Format price per night for hotels.
 */
export const formatPricePerNight = (amount) =>
  `${formatPrice(amount)}/night`;

/**
 * Calculate total price.
 */
export const calcTotal = (basePrice, passengers = 1, taxes = 0.1) => {
  const subtotal = basePrice * passengers;
  const tax = subtotal * taxes;
  return {
    subtotal,
    tax,
    total: subtotal + tax,
  };
};

/**
 * Format a price range.
 */
export const formatPriceRange = (min, max) => {
  if (!max || max === Infinity) return `Above ${formatPrice(min)}`;
  return `${formatPrice(min)} – ${formatPrice(max)}`;
};