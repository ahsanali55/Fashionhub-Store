'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiUpload, FiX } from 'react-icons/fi';
import { BackButton } from '@/components/BackButton';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function SupplierAddProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Jackets',
    price: '',
    description: '',
    stock: '',
    images: [] as File[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Valid stock quantity is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.images.length === 0) newErrors.images = 'At least one product image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData({ ...formData, images: files });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    router.push('/supplier/products');
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
          <BackButton fallbackHref="/supplier/products" />
          <h1 className="text-4xl font-bold mb-2 mt-6">Add New Product</h1>
          <p className="text-muted-foreground">List a new product for sale</p>
        </motion.div>

        {/* Form */}
        <motion.form
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit}
          className="bg-card rounded-lg shadow-sm p-8 space-y-6"
        >
          {/* Product Name */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block font-medium">Product Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-3 bg-secondary border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition ${
                errors.name ? 'border-destructive' : 'border-border'
              }`}
              placeholder="Enter product name"
            />
            {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
          </motion.div>

          {/* Category */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block font-medium">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition"
            >
              <option>Jackets</option>
              <option>Dresses</option>
              <option>Shirts</option>
              <option>Shoes</option>
              <option>Accessories</option>
            </select>
          </motion.div>

          {/* Price */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block font-medium">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className={`w-full px-4 py-3 bg-secondary border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition ${
                  errors.price ? 'border-destructive' : 'border-border'
                }`}
                placeholder="0.00"
              />
              {errors.price && <p className="text-destructive text-sm">{errors.price}</p>}
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <label className="block font-medium">Stock Quantity *</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className={`w-full px-4 py-3 bg-secondary border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition ${
                  errors.stock ? 'border-destructive' : 'border-border'
                }`}
                placeholder="0"
              />
              {errors.stock && <p className="text-destructive text-sm">{errors.stock}</p>}
            </div>
          </motion.div>

          {/* Description */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block font-medium">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className={`w-full px-4 py-3 bg-secondary border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition ${
                errors.description ? 'border-destructive' : 'border-border'
              }`}
              placeholder="Describe your product..."
            />
            {errors.description && <p className="text-destructive text-sm">{errors.description}</p>}
          </motion.div>

          {/* Images */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block font-medium">Product Images *</label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer block">
                <FiUpload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="font-medium">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
              </label>
            </div>
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {formData.images.map((file, idx) => (
                  <div key={idx} className="relative group">
                    <img src={URL.createObjectURL(file)} alt={`preview-${idx}`} className="w-full h-24 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                      className="absolute top-1 right-1 bg-destructive text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {errors.images && <p className="text-destructive text-sm">{errors.images}</p>}
          </motion.div>

          {/* Submit */}
          <motion.button
            variants={itemVariants}
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition font-bold disabled:opacity-50"
          >
            {isSubmitting ? 'Creating Product...' : 'Create Product'}
          </motion.button>
        </motion.form>
      </div>
    </main>
  );
}
