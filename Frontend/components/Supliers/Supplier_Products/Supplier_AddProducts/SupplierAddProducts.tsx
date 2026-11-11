'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FiArrowLeft, FiPlus, FiImage, FiHash } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createProduct, getCategories } from '@/services/management.services';
import { useAppDispatch } from '@/hooks/redux';
import { loadProducts } from '@/redux/slices/productsSlice';
import { getErrorMessage } from '@/lib/utils';

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

export default function SupplierAddProductPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [categories, setCategories] = useState<Array<{ _id: string; name: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((requestError: unknown) => {
        setError(requestError instanceof Error ? requestError.message : 'Unable to load categories.');
      });
  }, []);

  useEffect(() => {
    if (!image) {
      setImagePreview('');
      return;
    }
    const previewUrl = URL.createObjectURL(image);
    setImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [image]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(formData.price);
    const stock = Number(formData.stock);
    if (!Number.isFinite(price) || price < 0.01 || price > 1000000000) {
      setError('Enter a valid price in PKR greater than zero.');
      return;
    }
    if (!Number.isInteger(stock) || stock < 0) {
      setError('Stock must be a non-negative whole number.');
      return;
    }
    if (!image) {
      setError('Choose a product image.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await createProduct({
        ...formData,
        price,
        stock,
        image,
      });
      await dispatch(loadProducts());
      router.push('/supplier/products');
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to create product.'));
    } finally {
      setIsSubmitting(false);
    }
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
            href="/supplier/dashboard"
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
              <label className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition cursor-pointer block">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="sr-only"
                  onChange={(event) => {
                    const selectedImage = event.target.files?.[0] ?? null;
                    if (selectedImage && !['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(selectedImage.type)) {
                      setError('Choose a JPG, PNG, WebP, or GIF image.');
                      setImage(null);
                      event.target.value = '';
                      return;
                    }
                    if (selectedImage && selectedImage.size > 5 * 1024 * 1024) {
                      setError('Product images must be 5 MB or smaller.');
                      setImage(null);
                      event.target.value = '';
                      return;
                    }
                    setError('');
                    setImage(selectedImage);
                  }}
                />
                {imagePreview ? (
                  <img src={imagePreview} alt="Product image preview" className="mx-auto mb-3 max-h-48 rounded-lg object-contain" />
                ) : (
                  <FiImage className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                )}
                <p className="text-sm text-muted-foreground">
                  {image?.name ?? 'Click to choose a product image'}
                </p>
              </label>
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
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>{category.name}</option>
                ))}
              </select>
            </motion.div>

            {/* Price and Stock Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price (PKR)</label>
                <div className="flex items-center gap-2 px-4 py-3 border border-border rounded-lg focus-within:ring-2 focus-within:ring-primary">
                  <span className="text-xs font-semibold text-muted-foreground">PKR</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0.01"
                    max="1000000000"
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
                    min="0"
                    step="1"
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
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <motion.div variants={itemVariants} className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting || categories.length === 0}
                className="flex-1 px-8 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition font-semibold flex items-center justify-center gap-2"
              >
                <FiPlus className="w-5 h-5" />
                {isSubmitting ? 'Saving...' : 'Add Product'}
              </button>
              <Link
                href="/supplier/products"
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
