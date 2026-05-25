'use client';

import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiPackage, FiTruck, FiCheckCircle } from 'react-icons/fi';
import { BackButton } from '@/components/BackButton';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function SupplierOrdersPage() {
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);
  const orders = useSelector((state: RootState) => state.orders);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated || auth.user?.role !== 'supplier') {
      router.push('/login');
      return;
    }
    setIsAuthorized(true);
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, [auth.isAuthenticated, auth.user?.role, router]);

  if (!isAuthorized) {
    return null;
  }

  if (isLoading) {
    return <LoadingSpinner fullScreen size="lg" text="Loading your orders..." />;
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
  };

  return (
    <main className="bg-background min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <BackButton fallbackHref="/supplier/dashboard" />
          <h1 className="text-4xl font-bold mb-2">Manage Orders</h1>
          <p className="text-muted-foreground">View and manage customer orders</p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 mb-8 overflow-x-auto pb-2"
        >
          {['All', 'Pending', 'Processing', 'Shipped', 'Delivered'].map((status) => (
            <button
              key={status}
              className="px-4 py-2 rounded-lg bg-secondary hover:bg-primary hover:text-white transition font-medium text-sm flex-shrink-0"
            >
              {status}
            </button>
          ))}
        </motion.div>

        {/* Orders Table */}
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
                  <th className="px-6 py-4 text-left text-sm font-semibold">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Items</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.items.map((order) => (
                  <motion.tr
                    key={order.id}
                    variants={itemVariants}
                    className="border-b border-border hover:bg-secondary transition"
                  >
                    <td className="px-6 py-4 font-semibold">#{order.id}</td>
                    <td className="px-6 py-4 text-sm">Customer #{Math.floor(Math.random() * 10000)}</td>
                    <td className="px-6 py-4 text-sm">{order.items.length} items</td>
                    <td className="px-6 py-4 font-semibold text-primary">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-primary hover:text-accent font-medium text-sm transition">
                        Update
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
