'use client';

import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { FiCheck, FiPackage, FiRefreshCw } from 'react-icons/fi';
import { EmptyState } from '@/components/Reusable_Components/EmptyState';
import { BackButton } from '@/components/Reusable_Components/BackButton';
import { LoadingSpinner } from '@/components/Admin/Loaders/LoadingSpinner';
import { getMyOrders, getOrderStatus, type Order } from '@/services/commerce.services';
import { formatPrice } from '@/lib/utils';

const orderStages = ['pending', 'processing', 'shipped', 'delivered'] as const;
const orderStageLabels = ['Placed', 'Processing', 'Shipped', 'Delivered'] as const;

export default function CustomerOrdersPage() {
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      setOrders(await getMyOrders());
    } catch (error: unknown) {
      setLoadError(
        error instanceof Error ? error.message : 'Unable to load your orders.',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!auth.isAuthenticated || auth.user?.role !== 'customer') {
      router.replace('/login');
      return;
    }

    void loadOrders();
  }, [auth.isAuthenticated, auth.user?.role, loadOrders, router]);

  if (!auth.isAuthenticated || auth.user?.role !== 'customer') return null;

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
          <BackButton fallbackHref="/customer/dashboard" alwaysNavigateToFallback />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Orders</h1>
              <p className="text-muted-foreground">Track your purchases and delivery progress</p>
            </div>
            {!isLoading && orders.length > 0 && (
              <button
                type="button"
                onClick={() => void loadOrders()}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:bg-secondary"
              >
                <FiRefreshCw className="h-4 w-4" />
                Refresh status
              </button>
            )}
          </div>
        </motion.div>

        {!loadError && orders.length > 0 && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
            <FiPackage className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p>
              Suppliers update each order item as it moves from placed to processing, shipped, and delivered. Refresh this page to check for the latest updates.
            </p>
          </div>
        )}

        {loadError ? (
          <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-destructive">
            {loadError}
          </p>
        ) : orders.length === 0 ? (
          <EmptyState
            type="orders"
            title="No orders yet"
            description="Start shopping to place your first order"
            actionLabel="Browse Products"
            actionHref="/shop"
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = getOrderStatus(order);
              const stageIndex = orderStages.indexOf(status);
              return (
                <motion.article
                  key={order._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5"
                >
                  <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold">Order #{order._id.slice(-8).toUpperCase()}</h2>
                        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold capitalize text-foreground">
                          {orderStageLabels[stageIndex] ?? 'Placed'}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-primary">{formatPrice(order.total)}</p>
                  </div>

                  <div className="grid grid-cols-4 gap-1 px-1 py-5 sm:px-3">
                    {orderStages.map((stage, index) => {
                      const completed = index <= stageIndex;
                      const current = index === stageIndex;
                      return (
                        <div key={stage} className="relative flex flex-col items-center text-center">
                          {index > 0 && (
                            <span
                              aria-hidden="true"
                              className={`absolute right-1/2 top-3 h-0.5 w-full ${index <= stageIndex ? 'bg-green-500' : 'bg-border'}`}
                            />
                          )}
                          <span className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full ${
                            completed ? 'bg-green-600 text-white' : 'border-2 border-border bg-card text-muted-foreground'
                          } ${current ? 'ring-4 ring-green-100' : ''}`}>
                            {index < stageIndex ? <FiCheck className="h-3.5 w-3.5" /> : (
                              <span className={`h-1.5 w-1.5 rounded-full ${completed ? 'bg-white' : 'bg-transparent'}`} />
                            )}
                          </span>
                          <span className={`mt-2 text-[10px] sm:text-xs ${completed ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                            {orderStageLabels[index]}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <details className="border-t border-border pt-3">
                    <summary className="cursor-pointer list-none text-sm font-semibold text-primary">
                      View items and individual status
                    </summary>
                    <div className="mt-3 divide-y divide-border">
                      {order.items.map((item) => {
                        const itemStatus = item.status ?? order.status;
                        const itemStageIndex = orderStages.indexOf(itemStatus);
                        return (
                          <div key={item.productId} className="flex items-center justify-between gap-3 py-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">{item.name}</p>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                Qty {item.quantity} · {formatPrice(item.price)} each
                              </p>
                            </div>
                            <div className="shrink-0 text-right">
                              <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
                              <p className="mt-0.5 text-xs capitalize text-muted-foreground">
                                {orderStageLabels[itemStageIndex] ?? 'Placed'}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </details>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
