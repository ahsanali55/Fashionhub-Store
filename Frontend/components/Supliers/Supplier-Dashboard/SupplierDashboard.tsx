'use client';

import { motion } from 'framer-motion';
import { useAppSelector } from '@/hooks/redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowRight, FiTrendingUp, FiBox, FiDollarSign, FiBarChart2, FiPlus, FiPackage, FiAlertCircle } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/Admin/Loaders/LoadingSpinner';
import { getSupplierAnalytics, type SupplierAnalytics } from '@/services/management.services';
import { getSupplierOrders, getOrderStatus, type Order } from '@/services/commerce.services';
import { getSupplierProducts } from '@/services/product.services';
import type { Product } from '@/redux/slices/productsSlice';
import { formatPrice, getErrorMessage } from '@/lib/utils';

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
  const [products, setProducts] = useState<Product[]>([]);
  const [analytics, setAnalytics] = useState<SupplierAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requestError, setRequestError] = useState('');

  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.role === 'supplier') {
      let active = true;
      Promise.all([getSupplierAnalytics(), getSupplierOrders(), getSupplierProducts()])
        .then(([metrics, supplierOrders, supplierProducts]) => {
          if (!active) return;
          setAnalytics(metrics);
          setOrders(supplierOrders);
          setProducts(supplierProducts);
        })
        .catch((error: unknown) => {
          if (active) setRequestError(getErrorMessage(error, 'Unable to load supplier dashboard.'));
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

  const orderItems = orders.flatMap((order) => order.items);
  const pendingItems = orderItems.filter((item) => (item.status ?? 'pending') === 'pending').length;
  const processingItems = orderItems.filter((item) => item.status === 'processing').length;
  const shippedItems = orderItems.filter((item) => item.status === 'shipped').length;
  const deliveredItems = orderItems.filter((item) => item.status === 'delivered').length;
  const lowStockProducts = products
    .filter((product) => product.stock <= 5)
    .sort((a, b) => a.stock - b.stock);
  const hiddenProducts = products.filter((product) => product.isVisible === false).length;

  return (
    <main className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold mb-2">Welcome back, {auth.user?.fullName}!</h1>
            <p className="text-muted-foreground">A quick view of your orders, inventory, and store performance.</p>
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
              <p className="mt-2 text-sm text-muted-foreground">
                {hiddenProducts} hidden · {products.filter((product) => product.stock <= 0).length} out of stock
              </p>
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

        <section className="mb-10 grid gap-6 lg:grid-cols-2" aria-label="Business operations">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Order fulfillment</h2>
                <p className="mt-1 text-sm text-muted-foreground">Product items grouped by their current stage.</p>
              </div>
              <FiPackage className="mt-1 h-5 w-5 text-primary" />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Pending', count: pendingItems, style: 'bg-yellow-100 text-yellow-800' },
                { label: 'Processing', count: processingItems, style: 'bg-blue-100 text-blue-800' },
                { label: 'Shipped', count: shippedItems, style: 'bg-purple-100 text-purple-800' },
                { label: 'Delivered', count: deliveredItems, style: 'bg-green-100 text-green-800' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-border p-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${item.style}`}>{item.label}</span>
                  <p className="mt-3 text-2xl font-bold tabular-nums">{item.count}</p>
                  <p className="mt-1 text-xs text-muted-foreground">items</p>
                </div>
              ))}
            </div>
            <Link href="/supplier/orders" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              Manage orders <FiArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Inventory attention</h2>
                <p className="mt-1 text-sm text-muted-foreground">Products at five units or fewer.</p>
              </div>
              <FiAlertCircle className="mt-1 h-5 w-5 text-primary" />
            </div>
            {lowStockProducts.length ? (
              <div className="mt-4 divide-y divide-border">
                {lowStockProducts.slice(0, 4).map((product) => (
                  <div key={product.id} className="flex items-center justify-between gap-3 py-3">
                    <span className="min-w-0 truncate text-sm font-medium">{product.name}</span>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      product.stock === 0 ? 'bg-destructive/10 text-destructive' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {product.stock === 0 ? 'Out of stock' : `${product.stock} left`}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-5 rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                No low-stock products. Your inventory is in good shape.
              </p>
            )}
            <Link href="/supplier/products" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              Review inventory <FiArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold">Quick actions</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Add a product', detail: 'Grow your catalog', href: '/supplier/products/add', icon: FiPlus },
              { label: 'Manage products', detail: 'Update stock and listings', href: '/supplier/products', icon: FiBox },
              { label: 'Manage orders', detail: 'Advance fulfillment', href: '/supplier/orders', icon: FiPackage },
            ].map(({ label, detail, href, icon: Icon }) => (
              <Link key={href} href={href} className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold group-hover:text-primary">{label}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{detail}</span>
                </span>
                <FiArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </section>

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
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            {orders.length === 0 ? (
              <p className="p-8 text-center text-sm text-muted-foreground">
                No orders for your products yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
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
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
