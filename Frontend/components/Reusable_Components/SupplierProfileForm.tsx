'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiCheck } from 'react-icons/fi';
import { LoadingSpinner } from '../Admin/Loaders/LoadingSpinner';


interface SupplierProfileFormProps {
  initialData: {
    businessName: string;
    category: string;
    email: string;
    phone: string;
    address: string;
  };
  onSave: (data: SupplierProfileFormProps['initialData']) => Promise<void>;
  onCancel: () => void;
}

export function SupplierProfileForm({
  initialData,
  onSave,
  onCancel,
}: SupplierProfileFormProps) {
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage('');

    try {
      await onSave(formData);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => {
        setSuccessMessage('');
        onCancel();
      }, 2000);
    } catch (error) {
      setErrors({ submit: 'Failed to update profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-card rounded-lg shadow-sm p-8 space-y-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Edit Business Information</h3>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-secondary rounded-lg transition"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {errors.submit && (
        <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
          <p className="text-sm text-destructive">{errors.submit}</p>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-green-500/10 border border-green-500 rounded-lg flex items-center gap-2">
          <FiCheck className="w-5 h-5 text-green-600" />
          <p className="text-sm text-green-700">{successMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Business Name</label>
          <input
            type="text"
            value={formData.businessName}
            onChange={(e) =>
              setFormData({ ...formData, businessName: e.target.value })
            }
            className={`w-full px-4 py-2 rounded-lg border ${errors.businessName
                ? 'border-destructive'
                : 'border-border'
              } bg-background focus:outline-none focus:ring-2 focus:ring-primary transition`}
            placeholder="Enter business name"
          />
          {errors.businessName && (
            <p className="text-sm text-destructive mt-1">{errors.businessName}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className={`w-full px-4 py-2 rounded-lg border ${errors.category ? 'border-destructive' : 'border-border'
              } bg-background focus:outline-none focus:ring-2 focus:ring-primary transition`}
          >
            <option value="">Select a category</option>
            <option value="Fashion & Clothing">Fashion & Clothing</option>
            <option value="Accessories">Accessories</option>
            <option value="Footwear">Footwear</option>
            <option value="Electronics">Electronics</option>
            <option value="Home & Garden">Home & Garden</option>
            <option value="Sports">Sports</option>
            <option value="Other">Other</option>
          </select>
          {errors.category && (
            <p className="text-sm text-destructive mt-1">{errors.category}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full px-4 py-2 rounded-lg border ${errors.email ? 'border-destructive' : 'border-border'
              } bg-background focus:outline-none focus:ring-2 focus:ring-primary transition`}
            placeholder="Enter email"
          />
          {errors.email && (
            <p className="text-sm text-destructive mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={`w-full px-4 py-2 rounded-lg border ${errors.phone ? 'border-destructive' : 'border-border'
              } bg-background focus:outline-none focus:ring-2 focus:ring-primary transition`}
            placeholder="Enter phone number"
          />
          {errors.phone && (
            <p className="text-sm text-destructive mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium mb-2">Address</label>
        <textarea
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          className={`w-full px-4 py-2 rounded-lg border ${errors.address ? 'border-destructive' : 'border-border'
            } bg-background focus:outline-none focus:ring-2 focus:ring-primary transition resize-none`}
          placeholder="Enter business address"
          rows={3}
        />
        {errors.address && (
          <p className="text-sm text-destructive mt-1">{errors.address}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-2 border border-border rounded-lg hover:bg-secondary transition disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <FiCheck className="w-5 h-5" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </motion.form>
  );
}
