import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay = 1000) {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => clearTimeout(timeoutID);
  }, [value, delay]);

  return { debounceValue };
}
