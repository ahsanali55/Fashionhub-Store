'use client';

import { useEffect, useState } from 'react';

export function useLoading(delay: number = 300) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 30;
      });
    }, delay);

    return () => clearInterval(interval);
  }, [isLoading, delay]);

  const startLoading = () => {
    setProgress(10);
    setIsLoading(true);
  };

  const finishLoading = () => {
    setProgress(100);
    setTimeout(() => setIsLoading(false), 300);
  };

  return { isLoading, progress, startLoading, finishLoading };
}
