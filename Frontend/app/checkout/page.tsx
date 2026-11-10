'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';
import { useAppDispatch } from '@/hooks/redux';
import { clearCart } from '@/redux/slices/cartSlice';
import { createOrder, removeCartItem } from '@/services/commerce.services';
import { formatPrice } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useSelector((state: RootState) => state.cart);
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    zipCode: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [placedOrderTotal, setPlacedOrderTotal] = useState(0);
  const [submissionError, setSubmissionError] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!auth.isAuthenticated || auth.user?.role !== 'customer') {
      router.push('/login');
      return;
    }
    if (cart.items.length === 0) {
      setSubmissionError('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionError('');
    try {
      const order = await createOrder({
        items: cart.items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: auth.user.fullName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.zipCode,
        },
        paymentMethod: 'Cash on Delivery',
      });
      setOrderId(order._id);
      setPlacedOrderTotal(order.total);
      const cleanup = await Promise.allSettled(
        cart.items.map((item) => removeCartItem(item.id)),
      );
      if (cleanup.some((result) => result.status === 'rejected')) {
        setSubmissionError('Order placed, but the saved cart could not be fully cleared.');
      }
      dispatch(clearCart());
      setOrderComplete(true);
    } catch (error) {
      setSubmissionError(
        error instanceof Error ? error.message : 'Unable to place your order.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = cart.items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  if (orderComplete) {
    return (
      <main className="bg-background min-h-screen py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-lg shadow-sm p-12 text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto"
            >
              <FiCheck className="w-8 h-8" />
            </motion.div>
            <h1 className="text-4xl font-bold">Order Placed Successfully!</h1>
            <p className="text-muted-foreground">Thank you for your purchase. Your order has been confirmed and will be shipped soon.</p>
            {submissionError && <p className="text-amber-700">{submissionError}</p>}
            <div className="space-y-2 text-sm">
              <p>
                <strong>Order Number:</strong> #{orderId}
              </p>
              <p>
                <strong>Total Amount:</strong> {formatPrice(placedOrderTotal)}
              </p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition font-medium"
            >
              Continue Shopping
            </button>
          </motion.div>
        </div>
      </main>
    );
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
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-primary hover:text-accent mb-6 transition"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-4xl font-bold mb-2">Checkout</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 bg-card rounded-lg shadow-sm p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Info */}
              <motion.div variants={itemVariants}>
                <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                {cart.items.length === 0 && (
                  <p role="alert" className="mb-4 text-sm text-destructive">
                    Your cart is empty. Add products before checking out.
                  </p>
                )}
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Delivering to {auth.user?.fullName} ({auth.user?.email})
                  </p>

                  <input
                    type="text"
                    placeholder="Address"
                    autoComplete="street-address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={`w-full px-4 py-3 bg-secondary border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition ${
                      errors.address ? 'border-destructive' : 'border-border'
                    }`}
                  />
                  {errors.address && <p className="text-destructive text-sm">{errors.address}</p>}

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      autoComplete="address-level2"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className={`px-4 py-3 bg-secondary border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition ${
                        errors.city ? 'border-destructive' : 'border-border'
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="ZIP Code"
                      autoComplete="postal-code"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      className={`px-4 py-3 bg-secondary border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition ${
                        errors.zipCode ? 'border-destructive' : 'border-border'
                      }`}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Payment Info */}
              <motion.div variants={itemVariants}>
                <h2 className="text-xl font-bold mb-4">Payment Information</h2>
                <p className="text-sm text-muted-foreground">
                  Cash on delivery is available for this order.
                </p>
              </motion.div>

              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={isSubmitting || cart.items.length === 0}
                className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition font-bold disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </motion.button>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            variants={itemVariants}
            className="bg-card rounded-lg shadow-sm p-8 h-fit"
          >
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6 border-b border-border pb-6">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span className="font-medium">{formatPrice(item.price * (item.quantity || 1))}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
