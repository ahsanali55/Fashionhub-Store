'use client';

import { motion } from 'framer-motion';
import { useAppSelector } from '@/hooks/redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BackButton } from '@/components/Reusable_Components/BackButton';
import { LoadingSpinner } from '@/components/Admin/Loaders/LoadingSpinner';
import { getSupplierOrders, updateOrderItemStatus, type Order } from '@/services/commerce.services';
import { formatPrice } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function SupplierOrdersPage() {
  const router = useRouter();
  const auth = useAppSelector((state: RootState) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);
  const [requestError, setRequestError] = useState('');

  useEffect(() => {
    if (!auth.isAuthenticated || auth.user?.role !== 'supplier') {
      router.push('/login');
      return;
    }
    setIsAuthorized(true);
    let active = true;
    getSupplierOrders()
      .then((response) => {
        if (active) setOrders(response);
      })
      .catch((error: unknown) => {
        if (active) setRequestError(error instanceof Error ? error.message : 'Unable to load supplier orders.');
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
    return <LoadingSpinner fullScreen size="lg" text="Loading your orders..." />;
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
  };

  const filteredOrders = selectedStatus === 'All'
    ? orders
    : orders.filter((order) => order.items.some(
      (item) => (item.status ?? order.status).toLowerCase() === selectedStatus.toLowerCase(),
    ));

  const handleStatusUpdate = async (
    orderId: string,
    productId: string,
    status: 'pending' | 'processing' | 'shipped' | 'delivered',
  ) => {
    const key = `${orderId}:${productId}`;
    setUpdatingItem(key);
    setRequestError('');
    try {
      const updatedOrder = await updateOrderItemStatus(orderId, productId, status);
      setOrders((current) => current.map((order) => order._id !== orderId ? order : {
        ...order,
        status: updatedOrder.status,
        items: order.items.map((item) => item.productId === productId ? { ...item, status } : item),
      }));
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : 'Unable to update order item.');
    } finally {
      setUpdatingItem(null);
    }
  };

  return (
    <main className="bg-background min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <BackButton fallbackHref="/supplier/dashboard" />
          <h1 className="text-4xl font-bold mb-2">Manage Orders</h1>
          <p className="text-muted-foreground">View and manage customer orders</p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 mb-8 overflow-x-auto pb-2"
        >
          {['All', 'Pending', 'Processing', 'Shipped', 'Delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg transition font-medium text-sm flex-shrink-0 ${selectedStatus === status ? 'bg-primary text-white' : 'bg-secondary hover:bg-primary hover:text-white'}`}
            >
              {status}
            </button>
          ))}
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
                  <th className="px-6 py-4 text-left text-sm font-semibold">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Quantity</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Item Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.flatMap((order) => order.items.map((item) => {
                  const status = (item.status ?? order.status ?? 'pending') as 'pending' | 'processing' | 'shipped' | 'delivered';
                  const itemKey = `${order._id}:${item.productId}`;
                  return (
                    <motion.tr key={itemKey} variants={itemVariants} className="border-b border-border hover:bg-secondary transition">
                      <td className="px-6 py-4 font-semibold">#{order._id}</td>
                      <td className="px-6 py-4 text-sm">{item.name}</td>
                      <td className="px-6 py-4 text-sm">{item.quantity}</td>
                      <td className="px-6 py-4 font-semibold text-primary">{formatPrice(item.price * item.quantity)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[status]}`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {status === 'delivered' ? (
                          <span className="text-sm text-muted-foreground">Complete</span>
                        ) : (
                          <button
                            type="button"
                            disabled={updatingItem === itemKey}
                            onClick={() => void handleStatusUpdate(
                              order._id,
                              item.productId,
                              ({ pending: 'processing', processing: 'shipped', shipped: 'delivered' } as const)[status],
                            )}
                            className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                            aria-label={`Advance ${item.name} from ${status}`}
                          >
                            {updatingItem === itemKey ? 'Updating...' : `Mark ${status === 'pending' ? 'processing' : status === 'processing' ? 'shipped' : 'delivered'}`}
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  );
                }))}
              </tbody>
            </table>
          </div>
          {requestError && <p role="alert" className="px-6 py-4 text-sm text-destructive">{requestError}</p>}
        </motion.div>
      </div>
    </main>
  );
}
