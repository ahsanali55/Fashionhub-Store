'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export function GlobalProgressBar() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => {
      setProgress(10);
      setIsVisible(true);
    };

    const handleStop = () => {
      setProgress(100);
      setTimeout(() => setIsVisible(false), 500);
    };

    // Listen for navigation events
    const handleRouteChange = () => {
      handleStart();
      const timer = setTimeout(handleStop, 800);
      return () => clearTimeout(timer);
    };

    // Simulate progress increment
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 20;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-accent via-accent/80 to-accent/60 z-[9999] origin-left"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: progress / 100 }}
      style={{ width: '100%' }}
      transition={{ duration: 0.3 }}
    />
  );
}
