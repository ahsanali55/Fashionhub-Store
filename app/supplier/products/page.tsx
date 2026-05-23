'use client';

import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { FiArrowLeft, FiEdit, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';
import Link from 'next/link';
import { useState } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function ManageProductsPage() {
  const products = useSelector((state: RootState) => state.products);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.items.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-primary hover:underline mb-6"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold">Manage Products</h1>
              <p className="text-muted-foreground mt-2">Edit, delete, or add new products to your store</p>
            </div>
            <Link
              href="/supplier/products/add"
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition font-semibold"
            >
              <FiPlus className="w-5 h-5" />
              Add Product
            </Link>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-lg">
            <FiSearch className="text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 focus:outline-none bg-transparent"
            />
          </div>
        </motion.div>

        {/* Products Table */}
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
                  <th className="px-6 py-4 text-left text-sm font-semibold">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Sales</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b border-border hover:bg-secondary transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <span className="font-medium text-sm">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{product.category}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-primary">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{Math.floor(Math.random() * 50)}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-border rounded transition">
                          <FiEdit className="w-5 h-5 text-primary" />
                        </button>
                        <button className="p-2 hover:bg-border rounded transition">
                          <FiTrash2 className="w-5 h-5 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No products found</p>
              <Link
                href="/supplier/products/add"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition"
              >
                <FiPlus className="w-5 h-5" />
                Add Your First Product
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
