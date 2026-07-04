'use client';

import { motion } from 'framer-motion';

export function ProductCardSkeleton() {
  return (
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="bg-card rounded-lg shadow-sm overflow-hidden"
    >
      <div className="aspect-square bg-secondary" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-secondary rounded w-3/4" />
        <div className="h-6 bg-secondary rounded w-1/2" />
        <div className="h-10 bg-secondary rounded w-full" />
      </div>
    </motion.div>
  );
}

export function TableRowSkeleton() {
  return (
    <motion.tr
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="border-b border-border"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-secondary rounded w-full" />
        </td>
      ))}
    </motion.tr>
  );
}

export function DashboardCardSkeleton() {
  return (
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="bg-card rounded-lg shadow-sm p-6"
    >
      <div className="h-4 bg-secondary rounded w-1/3 mb-3" />
      <div className="h-8 bg-secondary rounded w-1/2 mb-3" />
      <div className="h-3 bg-secondary rounded w-1/4" />
    </motion.div>
  );
}
