/**
 * Debounce utility function
 * Delays invoking a function until after wait milliseconds have elapsed
 * since the last time the debounced function was invoked.
 *
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @returns {Function} Debounced function with cancel method
 */
export const debounce = (func, wait) => {
  let timeout;
  const debounced = (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
  debounced.cancel = () => {
    clearTimeout(timeout);
  };
  return debounced;
};
