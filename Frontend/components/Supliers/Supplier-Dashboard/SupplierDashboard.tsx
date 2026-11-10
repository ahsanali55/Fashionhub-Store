'use client';

import { motion } from 'framer-motion';
import { useAppSelector } from '@/hooks/redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiTrendingUp, FiBox, FiDollarSign, FiBarChart2 } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/Admin/Loaders/LoadingSpinner';
import { getSupplierAnalytics, type SupplierAnalytics } from '@/services/management.services';
import { getSupplierOrders, getOrderStatus, type Order } from '@/services/commerce.services';
import { formatPrice } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function SupplierDashboardPage() {
  const router = useRouter();
  const auth = useAppSelector((state: RootState) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<SupplierAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requestError, setRequestError] = useState('');

  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.role === 'supplier') {
      let active = true;
      Promise.all([getSupplierAnalytics(), getSupplierOrders()])
        .then(([metrics, supplierOrders]) => {
          if (!active) return;
          setAnalytics(metrics);
          setOrders(supplierOrders);
        })
        .catch((error: unknown) => {
          if (active) setRequestError(error instanceof Error ? error.message : 'Unable to load supplier dashboard.');
        })
        .finally(() => { if (active) setIsLoading(false); });
      return () => { active = false; };
    }
  }, [auth.isAuthenticated, auth.user?.role]);

  if (!auth.isAuthenticated || auth.user?.role !== 'supplier') {
    router.push('/login');
    return null;
  }

  if (isLoading) {
    return <LoadingSpinner fullScreen size="lg" text="Loading your dashboard..." />;
  }

  const pendingItems = orders.flatMap((order) => order.items)
    .filter((item) => (item.status ?? 'pending') === 'pending').length;

  return (
    <main className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold mb-2">Welcome back, {auth.user?.fullName}!</h1>
            <p className="text-muted-foreground">Manage your business from here</p>
          </motion.div>
        </div>

        {requestError && <p role="alert" className="mb-6 text-sm text-destructive">{requestError}</p>}

        {/* Key Metrics */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4 mb-12"
        >
          <motion.div variants={itemVariants} className="flex min-h-44 flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex h-10 items-start justify-between gap-3">
              <p className="text-sm font-medium leading-5 text-muted-foreground">Total Revenue</p>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FiDollarSign className="h-5 w-5" />
              </span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-2xl font-bold leading-tight tracking-tight tabular-nums sm:text-3xl" title={analytics ? formatPrice(analytics.totalRevenue) : undefined}>
                {analytics ? formatPrice(analytics.totalRevenue) : '—'}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Total sales revenue</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex min-h-44 flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex h-10 items-start justify-between gap-3">
              <p className="text-sm font-medium leading-5 text-muted-foreground">Products Listed</p>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <FiBox className="h-5 w-5" />
              </span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-2xl font-bold leading-tight tracking-tight tabular-nums sm:text-3xl">{analytics?.totalProducts ?? '—'}</p>
              <p className="mt-2 text-sm text-muted-foreground">Active products</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex min-h-44 flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex h-10 items-start justify-between gap-3">
              <p className="text-sm font-medium leading-5 text-muted-foreground">Orders</p>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <FiTrendingUp className="h-5 w-5" />
              </span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-2xl font-bold leading-tight tracking-tight tabular-nums sm:text-3xl">{analytics?.totalOrders ?? '—'}</p>
              <p className="mt-2 text-sm text-muted-foreground">{pendingItems} pending items</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex min-h-44 flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex h-10 items-start justify-between gap-3">
              <p className="text-sm font-medium leading-5 text-muted-foreground">Average Rating</p>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FiBarChart2 className="h-5 w-5" />
              </span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-2xl font-bold leading-tight tracking-tight tabular-nums sm:text-3xl">
                {analytics ? `${analytics.averageRating.toFixed(1)} / 5` : '—'}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Across your products</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Orders</h2>
            <Link href="/supplier/orders" className="text-primary hover:text-accent font-medium transition">
              View All →
            </Link>
          </div>
          <div className="bg-card rounded-lg shadow-sm overflow-hidden">
            {orders.length === 0 ? (
              <p className="p-8 text-center text-sm text-muted-foreground">
                No orders for your products yet.
              </p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary">
                    <th className="px-6 py-4 text-left text-sm font-semibold">Order ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Items</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Total</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => {
                    const status = getOrderStatus(order);
                    return (
                      <motion.tr
                        key={order._id}
                        variants={itemVariants}
                        className="border-b border-border hover:bg-secondary transition"
                      >
                        <td className="px-6 py-4 font-semibold">
                          <Link href="/supplier/orders" className="text-primary hover:underline">
                            #{order._id}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-sm">{order.items.length} items</td>
                        <td className="px-6 py-4 font-semibold text-primary">
                          {formatPrice(order.items.reduce((sum, item) => sum + item.price * item.quantity, 0))}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                            status === 'delivered' ? 'bg-green-100 text-green-800' :
                              status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                  'bg-yellow-100 text-yellow-800'
                          }`}>
                            {status}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
