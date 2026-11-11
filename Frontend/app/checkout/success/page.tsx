'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight, FiCheckCircle, FiPackage, FiShoppingBag } from 'react-icons/fi';

export default function CheckoutSuccessPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary/10 to-transparent" />
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-2xl"
      >
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="px-6 pb-8 pt-10 text-center sm:px-12 sm:pt-12">
            <motion.div
              animate={{ scale: [0.8, 1.08, 1] }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-700 ring-8 ring-green-50"
            >
              <FiCheckCircle className="h-9 w-9" />
            </motion.div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">FashionHub order update</p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Your order is confirmed</h1>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
              Thank you for shopping with us. Your order details and fulfillment status are available in your order history.
            </p>
            <div className="mx-auto mt-7 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-800">
              <span className="h-2 w-2 rounded-full bg-green-600" />
              Order placed
            </div>
          </div>

          <div className="mx-6 flex gap-3 border-y border-border py-5 text-left sm:mx-12">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
              <FiPackage className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">Track your purchase</p>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                Sign in to view your order status, items, and payment details.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 px-6 py-6 sm:flex-row sm:justify-center sm:px-12">
            <Link
              href="/customer/orders"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
            >
              <FiPackage className="h-4 w-4" />
              View my orders
              <FiArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-3 font-semibold transition hover:bg-secondary"
            >
              <FiShoppingBag className="h-4 w-4" />
              Continue shopping
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
