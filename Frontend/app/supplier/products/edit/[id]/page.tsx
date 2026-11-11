'use client';

import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { FiArrowLeft, FiHash, FiSave } from 'react-icons/fi';
import Link from 'next/link';
import { useState } from 'react';
import { updateProduct } from '@/services/management.services';
import { useAppDispatch } from '@/hooks/redux';
import { loadProducts } from '@/redux/slices/productsSlice';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const products = useSelector((state: RootState) => state.products);
  const dispatch = useAppDispatch();
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [requestError, setRequestError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setRequestError('');
    try {
      await updateProduct(productId, {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        stock: Number(formData.stock),
        description: formData.description,
        imageFile: imageFile ?? undefined,
      });
      await dispatch(loadProducts());
      setSaved(true);
      router.push('/supplier/products');
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : 'Unable to save product changes.');
    } finally {
      setSaving(false);
    }
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
              <label className="block text-sm font-semibold mb-2">Price (PKR)</label>
              <div className="flex items-center gap-2 px-4 py-3 border border-border rounded-lg focus-within:ring-2 focus-within:ring-accent bg-background">
                <span className="text-sm font-medium text-muted-foreground">PKR</span>
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

            {/* Product Image */}
            <div>
              <label className="block text-sm font-semibold mb-2">Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                className="w-full text-sm"
              />
            </div>

            {/* Image Preview */}
            {formData.image && (
              <div className="pt-4">
                <label className="block text-sm font-semibold mb-2">Image Preview</label>
                <img
                  src={imageFile ? URL.createObjectURL(imageFile) : formData.image}
                  alt={formData.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}

            {requestError && <p role="alert" className="text-sm text-destructive">{requestError}</p>}

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
