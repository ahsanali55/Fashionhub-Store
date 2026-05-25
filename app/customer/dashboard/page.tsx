'use client';

import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiShoppingBag, FiHeart, FiTrendingUp, FiSettings, FiArrowRight } from 'react-icons/fi';
import { LogoutButton } from '@/components/LogoutButton';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

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
  const auth = useSelector((state: RootState) => state.auth);
  const cart = useSelector((state: RootState) => state.cart);
  const wishlist = useSelector((state: RootState) => state.wishlist);
  const orders = useSelector((state: RootState) => state.orders);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      router.push('/login');
      return;
    }
    setIsAuthorized(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [auth.isAuthenticated, router]);

  if (!isAuthorized) {
    return null;
  }

  if (isLoading) {
    return <LoadingSpinner fullScreen size="lg" text="Loading your dashboard..." />;
  }

  const quickLinks = [
    { label: 'My Orders', icon: FiShoppingBag, href: '/customer/orders', count: Array.isArray(orders) ? orders.length : 0 },
    { label: 'Wishlist', icon: FiHeart, href: '/customer/wishlist', count: Array.isArray(wishlist) ? wishlist.length : 0 },
    { label: 'Settings', icon: FiSettings, href: '/customer/settings' },
  ];

  return (
    <main className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Logout */}
        <div className="flex items-start justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold mb-2">Welcome back, {auth.user?.name}!</h1>
            <p className="text-muted-foreground">Here&apos;s your personalized dashboard</p>
          </motion.div>
          <LogoutButton variant="full" />
        </div>

        {/* Quick Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <motion.div variants={itemVariants} className="bg-card rounded-lg shadow-sm p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Cart Items</p>
                <p className="text-4xl font-bold mt-2">{Array.isArray(cart) ? cart.length : 0}</p>
              </div>
              <FiShoppingBag className="w-12 h-12 text-primary opacity-20" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-card rounded-lg shadow-sm p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Wishlist</p>
                <p className="text-4xl font-bold mt-2">{Array.isArray(wishlist) ? wishlist.length : 0}</p>
              </div>
              <FiHeart className="w-12 h-12 text-accent opacity-20" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-card rounded-lg shadow-sm p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Orders</p>
                <p className="text-4xl font-bold mt-2">{Array.isArray(orders) ? orders.length : 0}</p>
              </div>
              <FiTrendingUp className="w-12 h-12 text-primary opacity-20" />
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <motion.div key={link.href} variants={itemVariants}>
                  <Link
                    href={link.href}
                    className="bg-card rounded-lg shadow-sm p-8 hover:shadow-md transition group block"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition">
                        <Icon className="w-6 h-6 text-primary group-hover:text-white transition" />
                      </div>
                      {link.count !== undefined && (
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
                          {link.count}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition">{link.label}</h3>
                    <FiArrowRight className="w-4 h-4 mt-3 text-primary opacity-0 group-hover:opacity-100 transition" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Orders</h2>
            <Link href="/customer/orders" className="text-primary hover:text-accent font-medium transition">
              View All →
            </Link>
          </div>
          {Array.isArray(orders) && orders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {orders.slice(0, 5).map((order) => (
                <motion.div
                  key={order.id}
                  variants={itemVariants}
                  className="bg-card rounded-lg shadow-sm p-6 border border-border hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Order #{order.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{order.items.length} items</p>
                  <p className="text-lg font-bold text-primary">${order.total.toFixed(2)}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-lg shadow-sm p-12 text-center">
              <p className="text-muted-foreground mb-4">No orders yet. Start shopping!</p>
              <Link href="/shop" className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition font-medium">
                Browse Products
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
