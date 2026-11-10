'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FiArrowRight,
  FiHeart,
  FiPackage,
  FiSettings,
  FiShoppingBag,
  FiUser,
} from 'react-icons/fi';
import { LoadingSpinner } from '@/components/Admin/Loaders/LoadingSpinner';
import { BackButton } from '@/components/Reusable_Components/BackButton';
import { useAppSelector } from '@/hooks/redux';
import { formatPrice, getErrorMessage } from '@/lib/utils';
import { getMyOrders, type Order } from '@/services/commerce.services';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function CustomerDashboardPage() {
  const router = useRouter();
  const auth = useAppSelector((state: RootState) => state.auth);
  const cart = useAppSelector((state: RootState) => state.cart.items);
  const wishlist = useAppSelector((state: RootState) => state.wishlist.items);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [requestError, setRequestError] = useState('');

  useEffect(() => {
    if (!auth.isAuthenticated || auth.user?.role !== 'customer') {
      router.replace('/login');
      return;
    }

    let active = true;
    getMyOrders()
      .then((customerOrders) => {
        if (active) setOrders(customerOrders);
      })
      .catch((error: unknown) => {
        if (active) setRequestError(getErrorMessage(error, 'Unable to load your orders.'));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [auth.isAuthenticated, auth.user?.role, router]);

  if (!auth.isAuthenticated || auth.user?.role !== 'customer') return null;
  if (isLoading) return <LoadingSpinner fullScreen size="lg" text="Loading your dashboard..." />;

  const quickLinks = [
    { label: 'My Orders', description: 'Track your purchases', icon: FiPackage, href: '/customer/orders', count: orders.length },
    { label: 'Wishlist', description: 'Your saved products', icon: FiHeart, href: '/customer/wishlist', count: wishlist.length },
    { label: 'Account settings', description: 'Profile and notifications', icon: FiSettings, href: '/customer/settings' },
  ];

  return (
    <main className="min-h-screen bg-muted/30 py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <BackButton fallbackHref="/shop" />
        <header className="mb-8 flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            {auth.user.avatar ? (
              <img
                src={auth.user.avatar}
                alt=""
                className="h-14 w-14 shrink-0 rounded-2xl border border-border object-cover shadow-sm"
              />
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-primary/10 text-primary shadow-sm">
                <FiUser className="h-6 w-6" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Customer overview</p>
              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                Welcome back, {auth.user.fullName.split(' ')[0]}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">Here&apos;s what&apos;s happening with your account.</p>
            </div>
          </div>
          <div className="flex shrink-0">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Shop now <FiArrowRight />
            </Link>
          </div>
        </header>

        {requestError && <p role="alert" className="mb-6 text-sm text-destructive">{requestError}</p>}

        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
          aria-label="Account overview"
        >
          {[
            { label: 'Cart items', value: cart.reduce((total, item) => total + item.quantity, 0), note: 'Ready for checkout', icon: FiShoppingBag },
            { label: 'Wishlist', value: wishlist.length, note: 'Products saved for later', icon: FiHeart },
            { label: 'Total orders', value: orders.length, note: 'All your purchases', icon: FiPackage },
            { label: 'Latest order', value: orders[0] ? formatPrice(orders[0].total) : '—', note: orders[0] ? new Date(orders[0].createdAt).toLocaleDateString() : 'No orders yet', icon: FiUser },
          ].map(({ label, value, note, icon: Icon }) => (
            <motion.article
              key={label}
              variants={itemVariants}
              className="flex min-h-40 flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex h-10 items-start justify-between gap-3">
                <p className="text-sm font-medium leading-5 text-muted-foreground">{label}</p>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-2xl font-bold leading-tight tracking-tight tabular-nums sm:text-3xl" title={typeof value === 'string' ? value : undefined}>
                  {value}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{note}</p>
              </div>
            </motion.article>
          ))}
        </motion.section>

        <section className="mb-10">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">Quick actions</h2>
              <p className="mt-1 text-sm text-muted-foreground">Jump to the things you use most.</p>
            </div>
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-5 md:grid-cols-3"
          >
            {quickLinks.map(({ label, description, icon: Icon, href, count }) => (
              <motion.div key={href} variants={itemVariants}>
                <Link
                  href={href}
                  className="group flex h-full items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold group-hover:text-primary">{label}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{description}</span>
                  </span>
                  {count !== undefined ? (
                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold tabular-nums">{count}</span>
                  ) : (
                    <FiArrowRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">Recent orders</h2>
              <p className="mt-1 text-sm text-muted-foreground">The latest updates on your purchases.</p>
            </div>
            <Link href="/customer/orders" className="shrink-0 text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          {orders.length ? (
            <div className="divide-y divide-border">
              {orders.slice(0, 5).map((order) => (
                <article key={order._id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'} · {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold capitalize text-primary">{order.status}</span>
                    <span className="font-semibold tabular-nums">{formatPrice(order.total)}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-muted/30 px-5 py-10 text-center">
              <FiPackage className="mx-auto mb-3 h-7 w-7 text-muted-foreground" />
              <p className="font-semibold">No orders yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Your orders will appear here after checkout.</p>
              <Link href="/shop" className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
                Browse products
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
