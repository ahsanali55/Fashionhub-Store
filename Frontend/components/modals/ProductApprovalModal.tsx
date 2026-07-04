'use client';

import { motion } from 'framer-motion';

interface ProductApprovalModalProps {
  isOpen: boolean;
  product: any | null;
  action: 'approve' | 'reject' | null;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
}

export function ProductApprovalModal({
  isOpen,
  product,
  action,
  onClose,
  onConfirm,
}: ProductApprovalModalProps) {
  if (!isOpen || !product || !action) return null;

  const messages = {
    approve: `Approve "${product.name}" for sale on FashionHub?`,
    reject: `Reject "${product.name}"? Please provide a reason.`,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-lg shadow-xl max-w-sm w-full mx-4 p-6 border border-border"
      >
        <h3 className="text-lg font-bold mb-2 capitalize">{action} Product</h3>
        <p className="text-muted-foreground mb-6">{messages[action]}</p>
        {action === 'reject' && (
          <textarea
            placeholder="Rejection reason..."
            className="w-full p-3 border border-border rounded-lg bg-secondary mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
          />
        )}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm()}
            className={`flex-1 px-4 py-2 text-white rounded-lg transition ${
              action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {action === 'approve' ? 'Approve' : 'Reject'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
