'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiX } from 'react-icons/fi';
import { isAxiosError } from 'axios';

interface SupplierProfileFormProps {
  initialData: {
    fullName: string;
    email: string;
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await onSave(formData);
      setSuccess(true);
      window.setTimeout(onCancel, 1200);
    } catch (error) {
      setError(
        isAxiosError<{ message?: string }>(error)
          ? error.response?.data?.message ?? error.message
          : error instanceof Error
            ? error.message
            : 'Failed to update profile. Please try again.',
      );
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
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Edit Account Information</h3>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cancel editing"
          className="p-2 hover:bg-secondary rounded-lg transition"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div role="alert" className="p-4 bg-destructive/10 border border-destructive rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {success && (
        <div role="status" className="p-4 bg-green-500/10 border border-green-500 rounded-lg flex items-center gap-2">
          <FiCheck className="w-5 h-5 text-green-600" />
          <p className="text-sm text-green-700">Profile updated successfully.</p>
        </div>
      )}

      <div>
        <label htmlFor="supplier-full-name" className="block text-sm font-medium mb-2">
          Full name
        </label>
        <input
          id="supplier-full-name"
          type="text"
          required
          minLength={3}
          maxLength={80}
          value={formData.fullName}
          onChange={(event) => setFormData({ ...formData, fullName: event.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition"
          autoComplete="name"
        />
      </div>

      <div>
        <label htmlFor="supplier-email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          id="supplier-email"
          type="email"
          required
          maxLength={254}
          value={formData.email}
          onChange={(event) => setFormData({ ...formData, email: event.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition"
          autoComplete="email"
        />
      </div>

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
          disabled={isLoading || success}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </motion.form>
  );
}
