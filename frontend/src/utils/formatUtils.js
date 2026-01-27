/**
 * Formats a number as a currency string.
 * @param {number} amount - The amount to format.
 * @returns {string} - The formatted currency string (e.g., "₦5,000,000").
 */
export const formatCurrency = (amount) => {
    return '₦' + (amount || 0).toLocaleString();
};

/**
 * Formats a number into a compact, human-readable string.
 * @param {number} amount - The amount to format.
 * @returns {string} - The formatted compact string (e.g., "5M", "500k").
 */
export const formatCompactPrice = (amount) => {
    if (!amount) return '0';

    return Intl.NumberFormat('en-US', {
        notation: "compact",
        maximumFractionDigits: 1
    }).format(amount);
};

/**
 * Returns a combined string with both full and compact formats if the amount is large.
 * @param {number} amount - The amount to format.
 * @returns {string} - e.g., "₦5,000,000 (5M)" or just "₦500" if small.
 */
export const formatPriceReadable = (amount) => {
    const full = formatCurrency(amount);
    if (!amount || amount < 100000) return full; // Don't abbreviate small numbers

    const compact = formatCompactPrice(amount);
    return `${full} (${compact})`;
};
