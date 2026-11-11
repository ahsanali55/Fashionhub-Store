'use client';

import { motion } from 'framer-motion';
import { useAppSelector } from '@/hooks/redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { FiPackage, FiCheck, FiTruck } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { BackButton } from '@/components/Reusable_Components/BackButton';
import { LoadingSpinner } from '@/components/Admin/Loaders/LoadingSpinner';
import { getAdminOrders, getOrderStatus, type Order as ApiOrder } from '@/services/commerce.services';
import { formatPrice } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
};

interface Order {
  id: string;
  items: any[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const auth = useAppSelector((state: RootState) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [requestError, setRequestError] = useState('');

  useEffect(() => {
    if (!auth.isAuthenticated || auth.user?.role !== 'admin') {
      router.push('/login');
      return;
    }
    setIsAuthorized(true);
    let active = true;
    getAdminOrders()
      .then((response) => {
        if (active) {
          setOrders(response.map((order: ApiOrder) => ({
            id: order._id,
            items: order.items,
            total: order.total,
            status: getOrderStatus(order),
            date: order.createdAt,
          })));
        }
      })
      .catch((error: unknown) => {
        if (active) setRequestError(error instanceof Error ? error.message : 'Unable to load orders.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, [auth.isAuthenticated, auth.user?.role, router]);

  if (!isAuthorized) {
    return null;
  }

  if (isLoading) {
    return <LoadingSpinner fullScreen size="lg" text="Loading orders..." />;
  }

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
          <h1 className="text-4xl font-bold mb-2">Orders</h1>
          <p className="text-muted-foreground">Manage platform orders and tracking</p>
        </motion.div>

        {requestError && <p role="alert" className="mb-6 text-sm text-destructive">{requestError}</p>}

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-lg shadow-sm p-12 text-center"
          >
            <FiPackage className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No orders found</p>
          </motion.div>
        ) : (
          <>
            {/* Stats */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
              <motion.div variants={itemVariants} className="bg-card p-6 rounded-lg shadow-sm">
                <p className="text-muted-foreground text-sm">Total Orders</p>
                <p className="text-4xl font-bold mt-2">{orders.length}</p>
                <p className="text-sm text-green-600 mt-2">+12% from last month</p>
              </motion.div>
              <motion.div variants={itemVariants} className="bg-card p-6 rounded-lg shadow-sm">
                <p className="text-muted-foreground text-sm">Total Revenue</p>
                <p className="text-4xl font-bold mt-2">
                  {formatPrice(orders.reduce((sum, order) => sum + order.total, 0))}
                </p>
                <p className="text-sm text-green-600 mt-2">+8% from last month</p>
              </motion.div>
              <motion.div variants={itemVariants} className="bg-card p-6 rounded-lg shadow-sm">
                <p className="text-muted-foreground text-sm">Pending Fulfillment</p>
                <p className="text-4xl font-bold mt-2">
                  {orders.filter((o) => o.status === 'pending' || o.status === 'processing').length}
                </p>
                <p className="text-sm text-orange-600 mt-2">Needs attention</p>
              </motion.div>
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
                      <th className="px-6 py-4 text-left text-sm font-semibold">Items</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Total</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <motion.tr
                        key={order.id}
                        variants={itemVariants}
                        className="border-b border-border hover:bg-secondary transition"
                      >
                        <td className="px-6 py-4 font-semibold">#{order.id}</td>
                        <td className="px-6 py-4 text-sm">{order.items.length} items</td>
                        <td className="px-6 py-4 font-semibold text-primary">{formatPrice(order.total)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[order.status]}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </main>
  );
}
