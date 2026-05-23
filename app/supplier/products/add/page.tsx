'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiArrowLeft, FiPlus, FiImage, FiDollarSign, FiHash } from 'react-icons/fi';
import Link from 'next/link';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    image: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Product added successfully!');
  };

  return (
    <main className="bg-background min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <h1 className="text-4xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground mt-2">Create and list a new product on FashionHub</p>
        </motion.div>

        {/* Form */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-card rounded-lg shadow-lg p-8 space-y-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium mb-3">Product Image</label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition cursor-pointer">
                <FiImage className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Drag and drop your image or click to browse</p>
              </div>
            </motion.div>

            {/* Product Name */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium mb-2">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </motion.div>

            {/* Category */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="">Select a category</option>
                <option value="jackets">Jackets</option>
                <option value="dresses">Dresses</option>
                <option value="shoes">Shoes</option>
                <option value="sweaters">Sweaters</option>
                <option value="accessories">Accessories</option>
                <option value="shirts">Shirts</option>
              </select>
            </motion.div>

            {/* Price and Stock Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price</label>
                <div className="flex items-center gap-2 px-4 py-3 border border-border rounded-lg focus-within:ring-2 focus-within:ring-primary">
                  <FiDollarSign className="text-muted-foreground" />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    required
                    className="flex-1 focus:outline-none bg-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Stock</label>
                <div className="flex items-center gap-2 px-4 py-3 border border-border rounded-lg focus-within:ring-2 focus-within:ring-primary">
                  <FiHash className="text-muted-foreground" />
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="0"
                    required
                    className="flex-1 focus:outline-none bg-transparent"
                  />
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your product in detail"
                rows={5}
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none resize-none"
              />
            </motion.div>

            {/* Buttons */}
            <motion.div variants={itemVariants} className="flex gap-4">
              <button
                type="submit"
                className="flex-1 px-8 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition font-semibold flex items-center justify-center gap-2"
              >
                <FiPlus className="w-5 h-5" />
                Add Product
              </button>
              <Link
                href="/dashboard"
                className="flex-1 px-8 py-3 border border-border rounded-lg hover:bg-secondary transition font-semibold text-center"
              >
                Cancel
              </Link>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
