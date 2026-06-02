import { useState, useEffect } from 'react';

/**
 * Custom React hook to defer rapid value changes by a specified delay time.
 * Designed to buffer search input keystrokes before hitting backend databases.
 * 
 * @param {any} value - The input value to debounce
 * @param {number} delay - The delay buffer in milliseconds (default: 400ms)
 * @returns {any} - The debounced value
 */
const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Setup timer to update value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup timer on value or delay changes, or unmount
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
