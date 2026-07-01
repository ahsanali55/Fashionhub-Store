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
    { name: 'Jackets', count: '234 items', image: 'https://images.unsplash.com/photo-1727515192207-3dc860bfd773?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Dresses', count: '456 items', image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Shoes', count: '567 items', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop' },
    { name: 'Sweaters', count: '189 items', image: 'https://plus.unsplash.com/premium_photo-1673125287084-e90996bad505?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Accessories', count: '345 items', image: 'https://images.unsplash.com/photo-1604306354577-68136efdf03b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Shirts', count: '123 items', image: 'https://media.istockphoto.com/id/1370743910/photo/shot-of-an-empty-clothing-boutique-with-the-latest-clothing-selection.jpg?s=2048x2048&w=is&k=20&c=15RKBK4IjNPWKKuN2S8GWVPNzZloHDnAz-HVoKQnHAk=' },
  ];

export default function CategoriesPage() {
  return (
    <main className="bg-background min-h-screen mt-5 md:mt-10 lg:mt-18">
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
