'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { removeFromCart, updateQuantity, toggleCart, clearCart } from '@/lib/slices/cartSlice';
import { FiX, FiTrash2, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function CartDrawer() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isOpen, items, total } = useSelector((state: RootState) => state.cart);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleCheckout = async () => {
    setIsProcessing(true);
    // Simulate order processing
    setTimeout(() => {
      setOrderPlaced(true);
      setIsProcessing(false);
      
      setTimeout(() => {
        dispatch(clearCart());
        dispatch(toggleCart());
        setOrderPlaced(false);
        router.push('/dashboard');
      }, 2000);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(toggleCart())}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-card shadow-lg z-50 flex flex-col border border-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold">Shopping Cart</h2>
              <button
                onClick={() => dispatch(toggleCart())}
                className="p-2 hover:bg-secondary rounded-lg transition"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-muted-foreground mb-4">Your cart is empty</p>
                  <Link
                    href="/shop"
                    onClick={() => dispatch(toggleCart())}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex gap-4 pb-4 border-b border-border"
                  >
                    {/* Image */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-primary font-semibold">${item.price.toFixed(2)}</p>

                      {/* Quantity */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() =>
                            dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))
                          }
                          className="px-2 py-1 bg-secondary rounded hover:bg-border transition text-xs"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() =>
                            dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))
                          }
                          className="px-2 py-1 bg-secondary rounded hover:bg-border transition text-xs"
                        >
                          +
                        </button>
                        <button
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="ml-auto p-1 text-destructive hover:bg-secondary rounded transition"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-6 space-y-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>

                {orderPlaced ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full bg-green-100 text-green-800 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                  >
                    <FiCheck className="w-5 h-5" />
                    Order Placed Successfully!
                  </motion.div>
                ) : (
                  <>
                    <button
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition font-medium disabled:opacity-50"
                    >
                      {isProcessing ? 'Processing...' : 'Checkout'}
                    </button>
                    <button
                      onClick={() => dispatch(toggleCart())}
                      className="w-full border border-border py-3 rounded-lg hover:bg-secondary transition font-medium"
                    >
                      Continue Shopping
                    </button>
                  </>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
