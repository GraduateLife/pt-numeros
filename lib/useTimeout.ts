import { useCallback, useEffect, useRef } from "react";

interface UseTimeoutResult {
  reset: () => void;
  clear: () => void;
}

export const useTimeout = (
  callback: () => void,
  delay: number,
): UseTimeoutResult => {
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const reset = useCallback(() => {
    clear();
    timeoutRef.current = setTimeout(() => {
      callbackRef.current();
    }, delay);
  }, [delay, clear]);

  return { reset, clear };
};
