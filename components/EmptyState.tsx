'use client';

import { motion } from 'framer-motion';
import { FiBox, FiHeart, FiShoppingBag } from 'react-icons/fi';
import Link from 'next/link';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  type?: 'cart' | 'wishlist' | 'orders';
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel = 'Browse Products',
  actionHref = '/shop',
  type = 'cart',
}: EmptyStateProps) {
  const icons = {
    cart: <FiShoppingBag className="w-16 h-16" />,
    wishlist: <FiHeart className="w-16 h-16" />,
    orders: <FiBox className="w-16 h-16" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="text-muted-foreground mb-4 opacity-50">
        {icon || icons[type]}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-8 max-w-sm">{description}</p>
      {actionHref && (
        <Link
          href={actionHref}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition font-medium"
        >
          {actionLabel}
        </Link>
      )}
    </motion.div>
  );
}
