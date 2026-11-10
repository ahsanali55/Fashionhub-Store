'use client';

import { useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface BackButtonProps {
  fallbackHref?: string;
  showText?: boolean;
  alwaysNavigateToFallback?: boolean;
}

export function BackButton({
  fallbackHref = '/customer/dashboard',
  showText = true,
  alwaysNavigateToFallback = false,
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (!alwaysNavigateToFallback && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <motion.button
      whileHover={{ x: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition mb-6 cursor-pointer"
    >
      <FiArrowLeft className="w-5 h-5" />
      {showText && <span className="font-medium">Back</span>}
    </motion.button>
  );
}
