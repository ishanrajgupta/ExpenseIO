// Currency formatting utility

export const currencyConfig = {
  USD: { symbol: '$', locale: 'en-US', name: 'US Dollar' },
  EUR: { symbol: '€', locale: 'de-DE', name: 'Euro' },
  GBP: { symbol: '£', locale: 'en-GB', name: 'British Pound' },
  INR: { symbol: '₹', locale: 'en-IN', name: 'Indian Rupee' },
  CAD: { symbol: 'CA$', locale: 'en-CA', name: 'Canadian Dollar' },
  AUD: { symbol: 'A$', locale: 'en-AU', name: 'Australian Dollar' },
};

/**
 * Format currency based on user's currency preference
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (USD, EUR, INR, etc.)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  const config = currencyConfig[currency] || currencyConfig.USD;
  
  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback if Intl is not available or currency is invalid
    return `${config.symbol}${amount.toLocaleString(config.locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
};

/**
 * Get currency symbol
 * @param {string} currency - Currency code
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (currency = 'USD') => {
  return currencyConfig[currency]?.symbol || '$';
};

/**
 * Format number with commas
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code for locale
 * @returns {string} Formatted number string
 */
export const formatNumber = (amount, currency = 'USD') => {
  const config = currencyConfig[currency] || currencyConfig.USD;
  return amount.toLocaleString(config.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
