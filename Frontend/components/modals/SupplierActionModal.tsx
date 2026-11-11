'use client';

import { motion } from 'framer-motion';

interface SupplierActionModalProps {
  isOpen: boolean;
  supplier: any | null;
  action: 'approve' | 'reject' | 'suspend' | 'activate' | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function SupplierActionModal({
  isOpen,
  supplier,
  action,
  onClose,
  onConfirm,
}: SupplierActionModalProps) {
  if (!isOpen || !supplier || !action) return null;

  const messages = {
    approve: `Approve ${supplier.name} as a platform supplier? They'll gain access to sell products.`,
    reject: `Reject ${supplier.name}? This cannot be easily undone.`,
    suspend: `Suspend ${supplier.name}? They won't be able to list or sell products.`,
    activate: `Reactivate ${supplier.name}? Their eligible products will be available for sale again.`,
  };

  const buttonText = {
    approve: 'Approve',
    reject: 'Reject',
    suspend: 'Suspend',
    activate: 'Reactivate',
  };

  const buttonColor = {
    approve: 'bg-green-600 hover:bg-green-700',
    reject: 'bg-red-600 hover:bg-red-700',
    suspend: 'bg-yellow-600 hover:bg-yellow-700',
    activate: 'bg-green-600 hover:bg-green-700',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-lg shadow-xl max-w-sm w-full mx-4 p-6 border border-border"
      >
        <h3 className="text-lg font-bold mb-2 capitalize">{action} Supplier</h3>
        <p className="text-muted-foreground mb-6">{messages[action]}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 text-white rounded-lg transition ${buttonColor[action]}`}
          >
            {buttonText[action]}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
