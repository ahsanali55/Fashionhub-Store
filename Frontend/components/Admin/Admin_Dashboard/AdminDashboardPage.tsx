'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowRight, FiBox, FiDollarSign, FiPackage, FiUsers } from 'react-icons/fi';
import { LoadingSpinner } from '@/components/Admin/Loaders/LoadingSpinner';
import {
  getAdminAnalytics,
  getAllProductsForManagement,
  getUsers,
  type AdminAnalytics,
  type AdminUser,
} from '@/services/management.services';
import { getAdminOrders, getOrderStatus, type Order } from '@/services/commerce.services';
import { formatPrice, getErrorMessage } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [totalProducts, setTotalProducts] = useState<number | null>(null);
  const [hiddenProducts, setHiddenProducts] = useState(0);
  const [pendingSuppliers, setPendingSuppliers] = useState<AdminUser[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [ordersNeedingAttention, setOrdersNeedingAttention] = useState(0);
  const [requestError, setRequestError] = useState('');

  useEffect(() => {
    if (!auth.isAuthenticated || auth.user?.role !== 'admin') {
      router.push('/login');
    } else {
      setIsAuthorized(true);
      let active = true;
      Promise.all([
        getAdminAnalytics(),
        getAllProductsForManagement(),
        getUsers(),
        getAdminOrders(),
      ])
        .then(([data, productRecords, users, orders]) => {
          if (!active) return;
          setAnalytics(data);
          setTotalProducts(productRecords.length);
          setHiddenProducts(productRecords.filter((product) => product.isVisible === false).length);
          setPendingSuppliers(users.filter((user) => user.role === 'supplier' && user.status === 'pending'));
          setRecentOrders(orders.slice(0, 5));
          setOrdersNeedingAttention(orders.filter((order) => {
            const status = getOrderStatus(order);
            return status === 'pending' || status === 'processing';
          }).length);
        })
        .catch((error: unknown) => {
          if (active) setRequestError(getErrorMessage(error, 'Unable to load dashboard data.'));
        })
        .finally(() => { if (active) setIsLoading(false); });
      return () => { active = false; };
    }
  }, [auth.isAuthenticated, auth.user?.role, router]);

  if (!isAuthorized) {
    return null;
  }

  if (isLoading) {
    return <LoadingSpinner fullScreen size="lg" text="Loading admin dashboard..." />;
  }

  return (
    <main className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back{auth.user?.fullName ? `, ${auth.user.fullName}` : ''}.
            </p>
          </motion.div>
        </div>

        {requestError && <p role="alert" className="mb-6 text-sm text-destructive">{requestError}</p>}

        {/* Key Metrics */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4 mb-10"
        >
          <motion.div variants={itemVariants} className="flex min-h-44 flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex h-10 items-start justify-between gap-3">
              <p className="text-sm font-medium leading-5 text-muted-foreground">Gross Sales</p>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FiDollarSign className="h-5 w-5" />
              </span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-2xl font-bold leading-tight tracking-tight tabular-nums sm:text-3xl" title={analytics ? formatPrice(analytics.totalRevenue) : undefined}>
                {analytics ? formatPrice(analytics.totalRevenue) : '—'}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Value of recorded orders</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex min-h-44 flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex h-10 items-start justify-between gap-3">
              <p className="text-sm font-medium leading-5 text-muted-foreground">Total Orders</p>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <FiBox className="h-5 w-5" />
              </span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-2xl font-bold leading-tight tracking-tight tabular-nums sm:text-3xl">{analytics?.totalOrders ?? '—'}</p>
              <p className="mt-2 text-sm text-muted-foreground">All platform orders</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex min-h-44 flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex h-10 items-start justify-between gap-3">
              <p className="text-sm font-medium leading-5 text-muted-foreground">Total Products</p>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FiBox className="h-5 w-5" />
              </span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-2xl font-bold leading-tight tracking-tight tabular-nums sm:text-3xl">{totalProducts ?? '—'}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {hiddenProducts} hidden from the marketplace
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex min-h-44 flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex h-10 items-start justify-between gap-3">
              <p className="text-sm font-medium leading-5 text-muted-foreground">Pending Suppliers</p>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <FiUsers className="h-5 w-5" />
              </span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-2xl font-bold leading-tight tracking-tight tabular-nums sm:text-3xl">{pendingSuppliers.length}</p>
              <p className="mt-2 text-sm text-muted-foreground">Applications awaiting review</p>
            </div>
          </motion.div>
        </motion.div>

        <section className="mb-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Needs attention</h2>
                <p className="mt-1 text-sm text-muted-foreground">Work queues that may need your review.</p>
              </div>
              <FiPackage className="mt-1 h-5 w-5 text-primary" />
            </div>
            <div className="mt-5 space-y-3">
              <Link href="/admin/suppliers" className="flex items-center justify-between rounded-xl border border-border p-4 transition hover:bg-muted/60">
                <span>
                  <span className="block text-sm font-medium">Supplier applications</span>
                  <span className="mt-1 block text-xs text-muted-foreground">Review pending supplier accounts</span>
                </span>
                <span className="flex items-center gap-2 text-sm font-semibold">
                  {pendingSuppliers.length}
                  <FiArrowRight className="h-4 w-4 text-muted-foreground" />
                </span>
              </Link>
              <Link href="/admin/orders" className="flex items-center justify-between rounded-xl border border-border p-4 transition hover:bg-muted/60">
                <span>
                  <span className="block text-sm font-medium">Recent orders to check</span>
                  <span className="mt-1 block text-xs text-muted-foreground">Orders currently pending or processing</span>
                </span>
                <span className="flex items-center gap-2 text-sm font-semibold">
                  {ordersNeedingAttention}
                  <FiArrowRight className="h-4 w-4 text-muted-foreground" />
                </span>
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-border p-6">
              <div>
                <h2 className="text-lg font-semibold">Recent orders</h2>
                <p className="mt-1 text-sm text-muted-foreground">Latest platform activity</p>
              </div>
              <Link href="/admin/orders" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                All orders <FiArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {recentOrders.length ? (
              <div className="divide-y divide-border">
                {recentOrders.map((order) => {
                  const status = getOrderStatus(order);
                  const customer = typeof order.userId === 'object' ? order.userId.fullName : 'Customer';
                  return (
                    <div key={order._id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">Order #{order._id.slice(-8)}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{customer} · {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold tabular-nums">{formatPrice(order.total)}</span>
                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium capitalize">{status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="p-8 text-center text-sm text-muted-foreground">No platform orders yet.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
