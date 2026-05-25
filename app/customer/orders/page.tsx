'use client';

import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiPackage } from 'react-icons/fi';
import { OrderTimeline } from '@/components/OrderTimeline';
import { EmptyState } from '@/components/EmptyState';
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

export default function CustomerOrdersPage() {
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);
  const orders = useSelector((state: RootState) => state.orders);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      router.push('/login');
      return;
    }
    setIsAuthorized(true);
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, [auth.isAuthenticated, router]);

  if (!isAuthorized) {
    return null;
  }

  if (isLoading) {
    return <LoadingSpinner fullScreen size="lg" text="Loading your orders..." />;
  }

  return (
    <main className="bg-background min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <BackButton fallbackHref="/customer/dashboard" />
          <h1 className="text-4xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your orders</p>
        </motion.div>

        {Array.isArray(orders) && orders.length === 0 ? (
          <EmptyState
            type="orders"
            title="No orders yet"
            description="Start shopping to place your first order"
            actionLabel="Browse Products"
            actionHref="/shop"
          />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {Array.isArray(orders) && orders.map((order) => (
              <motion.div key={order.id} variants={itemVariants} className="bg-card rounded-lg shadow-sm p-8">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
                  <div>
                    <h2 className="text-2xl font-bold">Order #{order.id}</h2>
                    <p className="text-muted-foreground text-sm">
                      Placed on {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">${order.total.toFixed(2)}</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 capitalize ${
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'shipped'
                            ? 'bg-purple-100 text-purple-800'
                            : order.status === 'processing'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-8 pb-8 border-b border-border">
                  <h3 className="font-semibold mb-4">Order Items</h3>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: 1</p>
                        </div>
                        <p className="font-semibold">${item.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h3 className="font-semibold mb-6">Order Status</h3>
                  <OrderTimeline
                    steps={[
                      {
                        status: order.status === 'pending' ? 'current' : 'completed',
                        label: 'Order Confirmed',
                        date: new Date(order.date).toLocaleDateString(),
                        icon: <FiPackage className="w-5 h-5" />,
                      },
                      {
                        status:
                          order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered'
                            ? order.status === 'processing'
                              ? 'current'
                              : 'completed'
                            : 'pending',
                        label: 'Being Prepared',
                        icon: <FiPackage className="w-5 h-5" />,
                      },
                      {
                        status:
                          order.status === 'shipped' || order.status === 'delivered'
                            ? order.status === 'shipped'
                              ? 'current'
                              : 'completed'
                            : 'pending',
                        label: 'Shipped',
                        icon: <FiPackage className="w-5 h-5" />,
                      },
                      {
                        status: order.status === 'delivered' ? 'completed' : 'pending',
                        label: 'Delivered',
                        icon: <FiPackage className="w-5 h-5" />,
                      },
                    ]}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}
