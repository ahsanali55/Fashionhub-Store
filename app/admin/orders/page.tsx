'use client';

import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { FiPackage, FiCheck, FiTruck } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { BackButton } from '@/components/BackButton';

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

const statusOptions = ['pending', 'processing', 'shipped', 'delivered'];

interface Order {
  id: string;
  items: any[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);
  const reduxOrders = useSelector((state: RootState) => state.orders);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  useEffect(() => {
    if (!auth.isAuthenticated || auth.user?.role !== 'admin') {
      router.push('/login');
    } else {
      setIsAuthorized(true);
      setOrders(reduxOrders.items as Order[]);
    }
  }, [auth.isAuthenticated, auth.user?.role, router, reduxOrders]);

  if (!isAuthorized) {
    return null;
  }

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus as any }
        : order
    ));
    setUpdatingId(null);
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
          <BackButton fallbackHref="/admin/dashboard" />
          <h1 className="text-4xl font-bold mb-2">Orders</h1>
          <p className="text-muted-foreground">Manage platform orders and tracking</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <motion.div variants={itemVariants} className="bg-card p-6 rounded-lg shadow-sm">
            <p className="text-muted-foreground text-sm">Total Orders</p>
            <p className="text-4xl font-bold mt-2">{orders.items.length}</p>
            <p className="text-sm text-green-600 mt-2">+12% from last month</p>
          </motion.div>
          <motion.div variants={itemVariants} className="bg-card p-6 rounded-lg shadow-sm">
            <p className="text-muted-foreground text-sm">Total Revenue</p>
            <p className="text-4xl font-bold mt-2">
              ${orders.items.reduce((sum, o) => sum + o.total, 0).toFixed(0)}K
            </p>
            <p className="text-sm text-green-600 mt-2">+8% from last month</p>
          </motion.div>
          <motion.div variants={itemVariants} className="bg-card p-6 rounded-lg shadow-sm">
            <p className="text-muted-foreground text-sm">Pending Fulfillment</p>
            <p className="text-4xl font-bold mt-2">
              {orders.items.filter((o) => o.status === 'pending' || o.status === 'processing').length}
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
                {orders.items.map((order) => (
                  <motion.tr
                    key={order.id}
                    variants={itemVariants}
                    className="border-b border-border hover:bg-secondary transition"
                  >
                    <td className="px-6 py-4 font-semibold">#{order.id}</td>
                    <td className="px-6 py-4 text-sm">{order.items.length} items</td>
                    <td className="px-6 py-4 font-semibold text-primary">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      {updatingId === order.id ? (
                        <select
                          value={selectedStatus}
                          onChange={(e) => {
                            handleStatusUpdate(order.id, e.target.value);
                            setSelectedStatus('');
                          }}
                          className="px-3 py-1 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          {statusOptions.map(status => (
                            <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                          ))}
                        </select>
                      ) : (
                        <button
                          onClick={() => {
                            setUpdatingId(order.id);
                            setSelectedStatus(order.status);
                          }}
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize cursor-pointer transition hover:opacity-80 ${statusColors[order.status]}`}
                        >
                          {order.status}
                        </button>
                      )}
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
      </div>
    </main>
  );
}
