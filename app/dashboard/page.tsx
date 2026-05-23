'use client';

import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { logout } from '@/lib/slices/authSlice';
import { useRouter } from 'next/navigation';
import { FiLogOut, FiPackage, FiHeart, FiUser, FiSettings, FiBarChart2, FiPlus, FiEdit, FiTrendingUp } from 'react-icons/fi';
import Link from 'next/link';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);
  const orders = useSelector((state: RootState) => state.orders);
  const wishlist = useSelector((state: RootState) => state.wishlist);
  const products = useSelector((state: RootState) => state.products);

  if (!auth.isAuthenticated) {
    router.push('/login');
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  // Role-specific content
  const isSupplier = auth.user?.role === 'supplier';
  const isAdmin = auth.user?.role === 'admin';
  const isCustomer = auth.user?.role === 'customer';

  return (
    <main className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-card p-8 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <img
                src={auth.user?.avatar}
                alt={auth.user?.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h1 className="text-3xl font-bold">{auth.user?.name}</h1>
                <p className="text-muted-foreground">
                  {auth.user?.email} • <span className="capitalize font-medium text-primary">{auth.user?.role}</span>
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-destructive text-white rounded-lg hover:opacity-90 transition font-medium"
            >
              <FiLogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </motion.div>

        {/* Customer Dashboard */}
        {isCustomer && (
          <>
            {/* Stats */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
              <motion.div variants={itemVariants} className="bg-card p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Orders</p>
                    <p className="text-4xl font-bold mt-2">{orders.items.length}</p>
                  </div>
                  <FiPackage className="w-12 h-12 text-primary opacity-20" />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-card p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Wishlist Items</p>
                    <p className="text-4xl font-bold mt-2">{wishlist.items.length}</p>
                  </div>
                  <FiHeart className="w-12 h-12 text-accent opacity-20" />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-card p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Spent</p>
                    <p className="text-4xl font-bold mt-2">
                      ${orders.items.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                    </p>
                  </div>
                  <FiUser className="w-12 h-12 text-primary opacity-20" />
                </div>
              </motion.div>
            </motion.div>

            {/* Orders Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="bg-card rounded-lg shadow-sm overflow-hidden">
                <div className="border-b border-border p-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <FiPackage className="w-6 h-6 text-primary" />
                    Recent Orders
                  </h2>
                </div>

                {orders.items.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-muted-foreground mb-4">You haven&apos;t placed any orders yet</p>
                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-secondary">
                          <th className="px-6 py-3 text-left text-sm font-semibold">Order ID</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.items.map((order) => (
                          <motion.tr
                            key={order.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border-b border-border hover:bg-secondary transition"
                          >
                            <td className="px-6 py-4 text-sm font-medium">{order.id}</td>
                            <td className="px-6 py-4 text-sm">{new Date(order.date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-sm font-semibold text-primary">${order.total.toFixed(2)}</td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[order.status]}`}>
                                {order.status}
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Quick Links */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  className="bg-card p-6 rounded-lg shadow-sm cursor-pointer hover:shadow-lg transition"
                >
                  <Link href="/wishlist" className="flex items-center gap-4">
                    <FiHeart className="w-10 h-10 text-accent" />
                    <div>
                      <h3 className="font-semibold">Wishlist</h3>
                      <p className="text-sm text-muted-foreground">{wishlist.items.length} items saved</p>
                    </div>
                  </Link>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  className="bg-card p-6 rounded-lg shadow-sm cursor-pointer hover:shadow-lg transition"
                >
                  <Link href="/settings" className="flex items-center gap-4">
                    <FiSettings className="w-10 h-10 text-primary" />
                    <div>
                      <h3 className="font-semibold">Account Settings</h3>
                      <p className="text-sm text-muted-foreground">Manage your profile</p>
                    </div>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}

        {/* Supplier Dashboard */}
        {isSupplier && (
          <>
            {/* Stats */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
            >
              <motion.div variants={itemVariants} className="bg-card p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Active Products</p>
                    <p className="text-4xl font-bold mt-2">{products.items.length}</p>
                  </div>
                  <FiPackage className="w-12 h-12 text-primary opacity-20" />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-card p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Pending Orders</p>
                    <p className="text-4xl font-bold mt-2">{orders.items.filter(o => o.status === 'pending').length}</p>
                  </div>
                  <FiTrendingUp className="w-12 h-12 text-accent opacity-20" />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-card p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Monthly Revenue</p>
                    <p className="text-4xl font-bold mt-2">$8,240</p>
                  </div>
                  <FiBarChart2 className="w-12 h-12 text-primary opacity-20" />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-card p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Sales</p>
                    <p className="text-4xl font-bold mt-2">{orders.items.length}</p>
                  </div>
                  <FiPackage className="w-12 h-12 text-accent opacity-20" />
                </div>
              </motion.div>
            </motion.div>

            {/* Actions */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <motion.button
                variants={itemVariants}
                className="flex items-center gap-3 px-6 py-4 bg-primary text-white rounded-lg hover:opacity-90 transition font-semibold"
                onClick={() => window.location.href = '/supplier/products/add'}
              >
                <FiPlus className="w-5 h-5" />
                Add New Product
              </motion.button>

              <motion.button
                variants={itemVariants}
                className="flex items-center gap-3 px-6 py-4 border border-border rounded-lg hover:bg-secondary transition font-semibold"
                onClick={() => window.location.href = '/supplier/products'}
              >
                <FiEdit className="w-5 h-5" />
                Manage Products
              </motion.button>

              <motion.button
                variants={itemVariants}
                className="flex items-center gap-3 px-6 py-4 border border-border rounded-lg hover:bg-secondary transition font-semibold"
                onClick={() => window.location.href = '/supplier/analytics'}
              >
                <FiBarChart2 className="w-5 h-5" />
                View Analytics
              </motion.button>
            </motion.div>

            {/* Orders */}
            <div className="bg-card rounded-lg shadow-sm overflow-hidden">
              <div className="border-b border-border p-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FiPackage className="w-6 h-6 text-primary" />
                  Recent Orders
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary">
                      <th className="px-6 py-3 text-left text-sm font-semibold">Order ID</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Customer</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Items</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.items.slice(0, 5).map((order) => (
                      <tr key={order.id} className="border-b border-border hover:bg-secondary transition">
                        <td className="px-6 py-4 text-sm font-medium">{order.id}</td>
                        <td className="px-6 py-4 text-sm">Customer #{Math.floor(Math.random() * 10000)}</td>
                        <td className="px-6 py-4 text-sm">{order.items.length}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-primary">${order.total.toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[order.status]}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Admin Dashboard */}
        {isAdmin && (
          <>
            {/* Stats */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
            >
              <motion.div variants={itemVariants} className="bg-card p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Users</p>
                    <p className="text-4xl font-bold mt-2">12,847</p>
                  </div>
                  <FiUser className="w-12 h-12 text-primary opacity-20" />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-card p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Active Sellers</p>
                    <p className="text-4xl font-bold mt-2">2,341</p>
                  </div>
                  <FiPackage className="w-12 h-12 text-accent opacity-20" />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-card p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Revenue</p>
                    <p className="text-4xl font-bold mt-2">$487K</p>
                  </div>
                  <FiBarChart3 className="w-12 h-12 text-primary opacity-20" />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-card p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Pending Reviews</p>
                    <p className="text-4xl font-bold mt-2">23</p>
                  </div>
                  <FiPackage className="w-12 h-12 text-accent opacity-20" />
                </div>
              </motion.div>
            </motion.div>

            {/* Actions */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <motion.button
                variants={itemVariants}
                className="flex items-center gap-3 px-6 py-4 bg-primary text-white rounded-lg hover:opacity-90 transition font-semibold"
              >
                <FiUser className="w-5 h-5" />
                Manage Users
              </motion.button>

              <motion.button
                variants={itemVariants}
                className="flex items-center gap-3 px-6 py-4 border border-border rounded-lg hover:bg-secondary transition font-semibold"
              >
                <FiPackage className="w-5 h-5" />
                Review Products
              </motion.button>

                <motion.button
                  variants={itemVariants}
                  className="flex items-center gap-3 px-6 py-4 border border-border rounded-lg hover:bg-secondary transition font-semibold"
                >
                  <FiBarChart2 className="w-5 h-5" />
                  Analytics
                </motion.button>
            </motion.div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-card rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold mb-4">Recent Users</h3>
                <div className="space-y-3">
                  {['John Doe', 'Sarah Smith', 'Mike Johnson', 'Emma Davis', 'James Wilson'].map((user, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <span>{user}</span>
                      <span className="text-xs text-muted-foreground">Today</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold mb-4">Flagged Items</h3>
                <div className="space-y-3">
                  {['Counterfeit Product', 'Policy Violation', 'Poor Quality Report', 'Seller Issue', 'Payment Error'].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-secondary rounded-lg hover:bg-border transition">
                      <span className="text-sm">{item}</span>
                      <button className="text-xs px-3 py-1 bg-primary text-white rounded hover:opacity-90">Review</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
