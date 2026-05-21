"use client";

import { useState, useEffect } from "react";

/** Default debounce delay in milliseconds */
const DEFAULT_DEBOUNCE_MS = 300;

/**
 * Debounce a value by a given delay in milliseconds.
 *
 * Returns the debounced value, which only updates after the delay
 * has elapsed since the last change to the input value.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = DEFAULT_DEBOUNCE_MS): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
