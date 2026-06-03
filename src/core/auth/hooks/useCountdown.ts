"use client";

import { useCallback, useEffect, useState } from "react";

export function useCountdown({ initialSeconds }: { initialSeconds: number }) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const isComplete = seconds <= 0;

  useEffect(() => {
    if (seconds <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      setSeconds((current) => current - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  const start = useCallback(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  const reset = useCallback(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  return {
    seconds,
    isComplete,
    start,
    reset,
  };
}
