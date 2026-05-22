'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

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

const categories = [
  { name: 'Jackets', count: 234, image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&h=500&fit=crop', color: 'from-blue-500 to-blue-600' },
  { name: 'Dresses', count: 456, image: 'https://images.unsplash.com/photo-1595777712802-34e6d1b3b900?w=500&h=500&fit=crop', color: 'from-pink-500 to-pink-600' },
  { name: 'Shoes', count: 567, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop', color: 'from-purple-500 to-purple-600' },
  { name: 'Sweaters', count: 189, image: 'https://images.unsplash.com/photo-1609902726285-97c33fd1b006?w=500&h=500&fit=crop', color: 'from-orange-500 to-orange-600' },
  { name: 'Accessories', count: 345, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop', color: 'from-green-500 to-green-600' },
  { name: 'Shirts', count: 123, image: 'https://images.unsplash.com/photo-1596784404467-bf437d714e4d?w=500&h=500&fit=crop', color: 'from-red-500 to-red-600' },
  { name: 'Bags', count: 98, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop', color: 'from-indigo-500 to-indigo-600' },
];

export default function CategoriesPage() {
  return (
    <main className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-secondary border-b border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-4xl font-bold">All Categories</h1>
            <p className="text-muted-foreground">Browse our complete collection of fashion items</p>
          </motion.div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {categories.map((category) => (
            <motion.div
              key={category.name}
              variants={itemVariants}
              whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
              className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
            >
              {/* Background Image */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>
              </div>

              {/* Content */}
              <div className="relative h-64 flex flex-col items-center justify-center text-center p-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-3"
                >
                  <h2 className="text-3xl font-bold text-white">{category.name}</h2>
                  <p className="text-gray-200">{category.count.toLocaleString()} items</p>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="pt-4"
                  >
                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-2 px-6 py-2 bg-white text-foreground rounded-lg hover:bg-gray-100 transition font-semibold"
                    >
                      Shop Now <FiArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-primary/10 to-accent/10 py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Can&apos;t find what you&apos;re looking for?</h2>
          <p className="text-muted-foreground mb-6">Use our search feature to discover exactly what you need</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-lg hover:opacity-90 transition font-semibold"
          >
            Go to Shop <FiArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
