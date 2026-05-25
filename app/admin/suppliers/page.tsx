'use client';

import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { FiSearch, FiTrash2, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { SupplierActionModal } from '@/components/modals/SupplierActionModal';
import { BackButton } from '@/components/BackButton';

interface Supplier {
  id: number;
  name: string;
  owner: string;
  email: string;
  products: number;
  status: 'active' | 'pending' | 'suspended';
  rating: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const mockSuppliers: Supplier[] = [
  { id: 1, name: 'Premium Fashion Co.', owner: 'Sarah Smith', email: 'sarah@fashion.com', products: 45, status: 'active', rating: 4.8 },
  { id: 2, name: 'Style Hub', owner: 'Mike Johnson', email: 'mike@stylehub.com', products: 32, status: 'active', rating: 4.5 },
  { id: 3, name: 'Trend Masters', owner: 'Emma Davis', email: 'emma@trends.com', products: 28, status: 'pending', rating: 0 },
  { id: 4, name: 'Classic Wear', owner: 'James Wilson', email: 'james@classic.com', products: 56, status: 'active', rating: 4.9 },
];

export default function AdminSuppliersPage() {
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [action, setAction] = useState<'approve' | 'reject' | 'suspend' | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!auth.isAuthenticated || auth.user?.role !== 'admin') {
      router.push('/login');
    } else {
      setIsAuthorized(true);
    }
  }, [auth.isAuthenticated, auth.user?.role, router]);

  if (!isAuthorized) {
    return null;
  }

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = (supplier: Supplier, actionType: 'approve' | 'reject' | 'suspend') => {
    setSelectedSupplier(supplier);
    setAction(actionType);
  };

  const handleConfirmAction = () => {
    if (!selectedSupplier || !action) return;

    const updatedSuppliers = suppliers.map(s => {
      if (s.id === selectedSupplier.id) {
        if (action === 'approve') {
          return { ...s, status: 'active' as const };
        } else if (action === 'reject') {
          return { ...s, status: 'suspended' as const };
        } else if (action === 'suspend') {
          return { ...s, status: 'suspended' as const };
        }
      }
      return s;
    });
    
    setSuppliers(updatedSuppliers);
    setSelectedSupplier(null);
    setAction(null);
  };

  const handleDelete = (id: number) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
    setDeletingId(null);
  };

  return (
    <main className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <BackButton fallbackHref="/admin/dashboard" />
          <h1 className="text-4xl font-bold mb-2">Supplier Management</h1>
          <p className="text-muted-foreground">Manage all platform suppliers</p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        </motion.div>

        {/* Suppliers Table */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-card rounded-lg shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary">
                  <th className="px-6 py-4 text-left text-sm font-semibold">Business Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Owner</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Products</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Rating</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.map((supplier) => (
                  <motion.tr
                    key={supplier.id}
                    variants={itemVariants}
                    className="border-b border-border hover:bg-secondary transition"
                  >
                    <td className="px-6 py-4 font-medium">{supplier.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{supplier.owner}</td>
                    <td className="px-6 py-4 text-sm font-semibold">{supplier.products}</td>
                    <td className="px-6 py-4 text-sm">
                      {supplier.rating > 0 ? (
                        <span className="text-amber-600 font-semibold">{supplier.rating.toFixed(1)}/5</span>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                          supplier.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {supplier.status === 'active' ? (
                          <FiCheckCircle className="w-3 h-3" />
                        ) : (
                          <FiXCircle className="w-3 h-3" />
                        )}
                        {supplier.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {supplier.status === 'pending' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleAction(supplier, 'approve')}
                            className="text-green-600 hover:text-green-700 font-medium text-sm transition"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleAction(supplier, 'reject')}
                            className="text-destructive hover:text-destructive/80 font-medium text-sm transition"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {supplier.status === 'active' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleAction(supplier, 'suspend')}
                            className="text-yellow-600 hover:text-yellow-700 font-medium text-sm transition"
                          >
                            Suspend
                          </button>
                          <button 
                            onClick={() => setDeletingId(supplier.id)}
                            className="text-destructive hover:text-destructive/80 transition"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Action Modal */}
        <SupplierActionModal
          isOpen={action !== null}
          supplier={selectedSupplier}
          action={action}
          onClose={() => { setAction(null); setSelectedSupplier(null); }}
          onConfirm={handleConfirmAction}
        />

        {/* Delete Confirmation */}
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card rounded-lg shadow-xl max-w-sm w-full mx-4 p-6 border border-border"
            >
              <h3 className="text-lg font-bold mb-2">Delete Supplier</h3>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to delete this supplier? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingId(null)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deletingId && handleDelete(deletingId)}
                  className="flex-1 px-4 py-2 bg-destructive text-white rounded-lg hover:opacity-90 transition"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
}
