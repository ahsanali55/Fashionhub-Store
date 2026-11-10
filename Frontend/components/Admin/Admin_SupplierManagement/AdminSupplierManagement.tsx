'use client';

import { motion } from 'framer-motion';
import { useAppSelector } from '@/hooks/redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { FiSearch, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { SupplierActionModal } from '@/components/modals/SupplierActionModal';
import { BackButton } from '@/components/Reusable_Components/BackButton';
import { approveSupplier, getAllProductsForManagement, getUsers, rejectSupplier, setUserActive, type AdminUser } from '@/services/management.services';

interface Supplier {
  id: string;
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

export default function AdminSuppliersManagementsPage() {
  const router = useRouter();
  const auth = useAppSelector((state: RootState) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [action, setAction] = useState<'approve' | 'reject' | 'suspend' | null>(null);
  const [requestError, setRequestError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated || auth.user?.role !== 'admin') {
      router.push('/login');
    } else {
      setIsAuthorized(true);
      let active = true;
      Promise.all([getUsers(), getAllProductsForManagement()])
        .then(([users, products]) => {
          if (!active) return;
          setSuppliers(users
            .filter((user: AdminUser) => user.role === 'supplier')
            .map((user) => {
              const supplierProducts = products.filter((product) =>
                typeof product.supplier === 'string'
                  ? product.supplier === user._id
                  : product.supplier?._id === user._id,
              );
              const ratings = supplierProducts.map((product) => product.rating ?? 0);
              return {
                id: user._id,
                name: user.fullName,
                owner: user.fullName,
                email: user.email,
                products: supplierProducts.length,
                status: user.status === 'pending'
                  ? 'pending'
                  : user.status === 'approved' && user.isActive
                    ? 'active'
                    : 'suspended',
                rating: ratings.length
                  ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
                  : 0,
              };
            }));
        })
        .catch((error: unknown) => {
          if (active) setRequestError(error instanceof Error ? error.message : 'Unable to load suppliers.');
        });
      return () => { active = false; };
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

  const handleConfirmAction = async () => {
    if (!selectedSupplier || !action) return;
    setIsUpdating(true);
    setRequestError('');
    try {
      if (action === 'approve') {
        await approveSupplier(selectedSupplier.id);
      } else if (action === 'reject') {
        await rejectSupplier(selectedSupplier.id);
      } else {
        await setUserActive(selectedSupplier.id, false);
      }
      setSuppliers((current) => current.map((supplier) =>
        supplier.id === selectedSupplier.id
          ? { ...supplier, status: action === 'approve' ? 'active' : 'suspended' }
          : supplier,
      ));
      setSelectedSupplier(null);
      setAction(null);
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : 'Unable to update supplier.');
    } finally {
      setIsUpdating(false);
    }
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

        {requestError && <p role="alert" className="mb-6 text-sm text-destructive">{requestError}</p>}

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
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${supplier.status === 'active'
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
          onConfirm={() => void handleConfirmAction()}
        />

      </div>
    </main>
  );
}
