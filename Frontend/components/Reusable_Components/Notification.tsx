'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';
import { useEffect, useState } from 'react';

interface NotificationProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  onDismiss?: (id: string) => void;
}

const typeConfig = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: FiCheckCircle,
    color: 'text-green-600',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: FiAlertCircle,
    color: 'text-red-600',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: FiAlertCircle,
    color: 'text-yellow-600',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: FiInfo,
    color: 'text-blue-600',
  },
};

export function Notification({
  id,
  type,
  message,
  duration = 5000,
  onDismiss,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const config = typeConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onDismiss]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className={`${config.bg} border ${config.border} rounded-lg p-4 flex items-start gap-3 shadow-sm`}
        >
          <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.color}`} />
          <p className="flex-1 text-sm font-medium text-foreground">{message}</p>
          <button
            onClick={() => {
              setIsVisible(false);
              onDismiss?.(id);
            }}
            className={`flex-shrink-0 ${config.color} hover:opacity-70 transition`}
          >
            <FiX className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
