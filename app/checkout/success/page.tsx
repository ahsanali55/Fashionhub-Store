'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiCheckCircle, FiPackage, FiArrowRight } from 'react-icons/fi';

export default function CheckoutSuccessPage() {
  return (
    <main className="bg-background min-h-screen flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="bg-card rounded-lg shadow-lg p-8 text-center space-y-6">
          <motion.div
            animate={{ scale: [0.8, 1.1, 1] }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </motion.div>

          <div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">Thank you for your purchase. Your order has been received.</p>
          </div>

          <div className="bg-secondary rounded-lg p-4 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order Number</span>
              <span className="font-semibold">#ORD-202406-001</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estimated Delivery</span>
              <span className="font-semibold">3-5 Business Days</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            We&apos;ve sent a confirmation email with your order details and tracking information.
          </p>

          <div className="space-y-3 pt-4">
            <Link
              href="/customer/orders"
              className="block w-full px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition font-semibold"
            >
              View My Orders
            </Link>
            <Link
              href="/shop"
              className="block w-full px-6 py-3 border border-border rounded-lg hover:bg-secondary transition font-semibold flex items-center justify-center gap-2"
            >
              Continue Shopping
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
