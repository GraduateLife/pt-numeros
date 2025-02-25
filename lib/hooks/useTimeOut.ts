import { useEffect, useRef, useState } from "react";

export const useTimeOut = (cb: () => void, seconds: number) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const timerRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000 * seconds);
    } else if (timeLeft === 0) {
      cb();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [cb, timeLeft]);

  return { timeLeft, setTimeLeft };
};
