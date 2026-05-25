'use client';

import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiTrendingUp, FiBox, FiDollarSign, FiBarChart2, FiArrowRight } from 'react-icons/fi';
import { LogoutButton } from '@/components/LogoutButton';

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
  const auth = useSelector((state: RootState) => state.auth);
  const products = useSelector((state: RootState) => state.products);
  const orders = useSelector((state: RootState) => state.orders);

  if (!auth.isAuthenticated || auth.user?.role !== 'supplier') {
    router.push('/login');
    return null;
  }

  const totalRevenue = orders.items.reduce((sum, o) => sum + o.total, 0);

  const quickLinks = [
    { label: 'Manage Products', icon: FiBox, href: '/supplier/products', count: products.items.length },
    { label: 'Orders', icon: FiTrendingUp, href: '/supplier/orders', count: orders.items.length },
    { label: 'Analytics', icon: FiBarChart2, href: '/supplier/analytics' },
    { label: 'Profile', icon: FiBox, href: '/supplier/profile' },
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
            <p className="text-muted-foreground">Manage your business from here</p>
          </motion.div>
          <LogoutButton variant="full" />
        </div>

        {/* Key Metrics */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <motion.div variants={itemVariants} className="bg-card rounded-lg shadow-sm p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Revenue</p>
                <p className="text-4xl font-bold mt-2">${totalRevenue.toFixed(0)}K</p>
                <p className="text-green-600 text-sm mt-2">+18% this month</p>
              </div>
              <FiDollarSign className="w-12 h-12 text-primary opacity-20" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-card rounded-lg shadow-sm p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Products Listed</p>
                <p className="text-4xl font-bold mt-2">{products.items.length}</p>
                <p className="text-primary text-sm mt-2">Active products</p>
              </div>
              <FiBox className="w-12 h-12 text-accent opacity-20" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-card rounded-lg shadow-sm p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Orders</p>
                <p className="text-4xl font-bold mt-2">{orders.items.length}</p>
                <p className="text-orange-600 text-sm mt-2">{orders.items.filter(o => o.status === 'pending' || o.status === 'processing').length} pending</p>
              </div>
              <FiTrendingUp className="w-12 h-12 text-accent opacity-20" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-card rounded-lg shadow-sm p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Rating</p>
                <p className="text-4xl font-bold mt-2">4.8★</p>
                <p className="text-muted-foreground text-sm mt-2">342 reviews</p>
              </div>
              <FiBarChart2 className="w-12 h-12 text-primary opacity-20" />
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <motion.div key={link.href} variants={itemVariants}>
                  <Link
                    href={link.href}
                    className="bg-card rounded-lg shadow-sm p-6 hover:shadow-md transition group block"
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
                    <h3 className="font-bold group-hover:text-primary transition">{link.label}</h3>
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
            <Link href="/supplier/orders" className="text-primary hover:text-accent font-medium transition">
              View All →
            </Link>
          </div>
          <div className="bg-card rounded-lg shadow-sm overflow-hidden">
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
                {orders.items.slice(0, 5).map((order) => (
                  <motion.tr
                    key={order.id}
                    variants={itemVariants}
                    className="border-b border-border hover:bg-secondary transition"
                  >
                    <td className="px-6 py-4 font-semibold">#{order.id}</td>
                    <td className="px-6 py-4 text-sm">{order.items.length} items</td>
                    <td className="px-6 py-4 font-semibold text-primary">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
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
