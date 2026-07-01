import React from 'react'
import { motion } from 'framer-motion';
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};
const categories = [
    { name: 'Jackets', count: '234 items', image: 'https://images.unsplash.com/photo-1727515192207-3dc860bfd773?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Dresses', count: '456 items', image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Shoes', count: '567 items', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop' },
    { name: 'Sweaters', count: '189 items', image: 'https://plus.unsplash.com/premium_photo-1673125287084-e90996bad505?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Accessories', count: '345 items', image: 'https://images.unsplash.com/photo-1604306354577-68136efdf03b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Shirts', count: '123 items', image: 'https://media.istockphoto.com/id/1370743910/photo/shot-of-an-empty-clothing-boutique-with-the-latest-clothing-selection.jpg?s=2048x2048&w=is&k=20&c=15RKBK4IjNPWKKuN2S8GWVPNzZloHDnAz-HVoKQnHAk=' },
  ];

export default function Categories() {
  return (
    <>
      {/* Categories Section */}
      <section className="py-10 md:py-22 px-4 sm:px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-4">
              Shop by Category
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-muted-foreground">
              Browse our curated collections across all categories.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {categories.map((category, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative h-64 rounded-xl overflow-hidden cursor-pointer"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-center text-white opacity-100 group-hover:opacity-100 transition">
                  <h3 className="text-2xl font-bold">{category.name}</h3>
                  <p className="text-sm text-gray-300 mt-2">{category.count}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}
