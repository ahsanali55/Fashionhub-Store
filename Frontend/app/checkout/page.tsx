'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';

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
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (formData.cardNumber.replace(/\s/g, '').length !== 16) newErrors.cardNumber = 'Valid card number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setOrderComplete(true);
    setIsSubmitting(false);
  };

  const subtotal = cart.items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

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
            <div className="space-y-2 text-sm">
              <p>
                <strong>Order Number:</strong> #ORD-{Math.floor(Math.random() * 1000000)}
              </p>
              <p>
                <strong>Total Amount:</strong> ${total.toFixed(2)}
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
                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-3 bg-secondary border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition ${
                      errors.email ? 'border-destructive' : 'border-border'
                    }`}
                  />
                  {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}

                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={`w-full px-4 py-3 bg-secondary border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition ${
                      errors.fullName ? 'border-destructive' : 'border-border'
                    }`}
                  />
                  {errors.fullName && <p className="text-destructive text-sm">{errors.fullName}</p>}

                  <input
                    type="text"
                    placeholder="Address"
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
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className={`px-4 py-3 bg-secondary border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition ${
                        errors.city ? 'border-destructive' : 'border-border'
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="ZIP Code"
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
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                    className={`w-full px-4 py-3 bg-secondary border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition ${
                      errors.cardNumber ? 'border-destructive' : 'border-border'
                    }`}
                  />
                  {errors.cardNumber && <p className="text-destructive text-sm">{errors.cardNumber}</p>}

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="px-4 py-3 bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      value={formData.cvv}
                      onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                      className="px-4 py-3 bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={isSubmitting}
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
                  <span className="font-medium">${(item.price * (item.quantity || 1)).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
