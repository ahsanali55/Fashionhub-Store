'use client';

import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { FiArrowLeft, FiImage, FiDollarSign, FiHash, FiSave } from 'react-icons/fi';
import Link from 'next/link';
import { useState } from 'react';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const products = useSelector((state: RootState) => state.products);
  const productId = params.id as string;
  const product = products.items.find(p => p.id === productId);

  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    description: product?.description || '',
    image: product?.image || '',
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => {
        router.push('/supplier/products');
      }, 1500);
    }, 1000);
  };

  if (!product) {
    return (
      <main className="bg-background min-h-screen py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-muted-foreground mb-4">Product not found</p>
          <Link href="/supplier/products" className="text-accent hover:underline font-semibold">
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/supplier/products"
            className="flex items-center gap-2 text-accent hover:underline mb-6"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back to Products
          </Link>
          <h1 className="text-4xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground mt-2">Update product information</p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card p-8 rounded-lg border border-border shadow-sm"
        >
          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-semibold mb-2">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background"
              >
                <option value="">Select a category</option>
                <option value="Jackets">Jackets</option>
                <option value="Dresses">Dresses</option>
                <option value="Shoes">Shoes</option>
                <option value="Sweaters">Sweaters</option>
                <option value="Accessories">Accessories</option>
                <option value="Shirts">Shirts</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows={4}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background resize-none"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold mb-2">Price</label>
              <div className="flex items-center gap-2 px-4 py-3 border border-border rounded-lg focus-within:ring-2 focus-within:ring-accent bg-background">
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

            {/* Stock */}
            <div>
              <label className="block text-sm font-semibold mb-2">Stock</label>
              <div className="flex items-center gap-2 px-4 py-3 border border-border rounded-lg focus-within:ring-2 focus-within:ring-accent bg-background">
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

            {/* Image URL */}
            <div>
              <label className="block text-sm font-semibold mb-2">Image URL</label>
              <div className="flex items-center gap-2 px-4 py-3 border border-border rounded-lg focus-within:ring-2 focus-within:ring-accent bg-background">
                <FiImage className="text-muted-foreground" />
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 focus:outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Image Preview */}
            {formData.image && (
              <div className="pt-4">
                <label className="block text-sm font-semibold mb-2">Image Preview</label>
                <img
                  src={formData.image}
                  alt={formData.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              {saved ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full bg-green-100 text-green-800 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  ✓ Product saved successfully!
                </motion.div>
              ) : (
                <>
                  <button
                    onClick={() => router.push('/supplier/products')}
                    className="flex-1 px-6 py-3 border border-border rounded-lg hover:bg-secondary transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-accent text-black font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <FiSave className="w-5 h-5" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
