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
      type="button"
      whileHover={{ x: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      aria-label={`Back to ${fallbackHref === '/customer/dashboard' ? 'customer dashboard' : 'previous page'}`}
      className="group mb-6 inline-flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <FiArrowLeft className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
      {showText && <span className="font-medium">Back</span>}
    </motion.button>
  );
}
