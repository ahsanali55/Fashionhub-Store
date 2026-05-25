'use client';

import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiSearch, FiCheckCircle, FiXCircle, FiEye, FiTrash2 } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { ProductApprovalModal } from '@/components/modals/ProductApprovalModal';

interface Product {
  id: number;
  name: string;
  supplier: string;
  price: number;
  status: 'approved' | 'pending' | 'rejected';
  category: string;
  sales: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const mockProducts: Product[] = [
  { id: 1, name: 'Premium Leather Jacket', supplier: 'Premium Fashion Co.', price: 299.99, status: 'approved', category: 'Jackets', sales: 45 },
  { id: 2, name: 'Summer Dress', supplier: 'Style Hub', price: 89.99, status: 'pending', category: 'Dresses', sales: 0 },
  { id: 3, name: 'Running Shoes', supplier: 'Classic Wear', price: 149.99, status: 'approved', category: 'Shoes', sales: 128 },
  { id: 4, name: 'Wool Sweater', supplier: 'Trend Masters', price: 59.99, status: 'approved', category: 'Sweaters', sales: 87 },
  { id: 5, name: 'Casual Shirt', supplier: 'Premium Fashion Co.', price: 49.99, status: 'rejected', category: 'Shirts', sales: 0 },
];

export default function AdminProductsPage() {
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
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

  const filteredProducts = products.filter(
    (product) =>
      (filterStatus === 'all' || product.status === filterStatus) &&
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.supplier.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAction = (product: Product, actionType: 'approve' | 'reject') => {
    setSelectedProduct(product);
    setAction(actionType);
  };

  const handleConfirmAction = () => {
    if (!selectedProduct || !action) return;

    const updatedProducts = products.map(p => {
      if (p.id === selectedProduct.id) {
        if (action === 'approve') {
          return { ...p, status: 'approved' as const };
        } else if (action === 'reject') {
          return { ...p, status: 'rejected' as const };
        }
      }
      return p;
    });
    
    setProducts(updatedProducts);
    setSelectedProduct(null);
    setAction(null);
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
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
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-primary hover:text-accent mb-6 transition"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-4xl font-bold mb-2">Product Management</h1>
          <p className="text-muted-foreground">Review and approve products</p>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 space-y-4"
        >
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {['all', 'approved', 'pending', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as any)}
                className={`px-4 py-2 rounded-lg font-medium text-sm flex-shrink-0 transition ${
                  filterStatus === status
                    ? 'bg-primary text-white'
                    : 'bg-secondary hover:bg-border'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Products Table */}
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
                  <th className="px-6 py-4 text-left text-sm font-semibold">Product Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Supplier</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Sales</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <motion.tr
                    key={product.id}
                    variants={itemVariants}
                    className="border-b border-border hover:bg-secondary transition"
                  >
                    <td className="px-6 py-4 font-medium">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{product.supplier}</td>
                    <td className="px-6 py-4 font-semibold">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">{product.sales}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                          product.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : product.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.status === 'approved' ? (
                          <FiCheckCircle className="w-3 h-3" />
                        ) : product.status === 'rejected' ? (
                          <FiXCircle className="w-3 h-3" />
                        ) : null}
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button className="text-primary hover:text-accent transition p-2">
                        <FiEye className="w-4 h-4" />
                      </button>
                      {product.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleAction(product, 'approve')}
                            className="text-green-600 hover:text-green-700 font-medium text-sm transition"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleAction(product, 'reject')}
                            className="text-destructive hover:text-destructive/80 font-medium text-sm transition"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {product.status === 'approved' && (
                        <button 
                          onClick={() => setDeletingId(product.id)}
                          className="text-destructive hover:text-destructive/80 transition"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Product Approval Modal */}
        <ProductApprovalModal
          isOpen={action !== null}
          product={selectedProduct}
          action={action}
          onClose={() => { setAction(null); setSelectedProduct(null); }}
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
              <h3 className="text-lg font-bold mb-2">Delete Product</h3>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to remove this product from the platform? This action cannot be undone.
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
