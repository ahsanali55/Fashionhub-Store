'use client';

import { motion } from 'framer-motion';
import { useAppSelector } from '@/hooks/redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { FiSearch, FiEye, FiTrash2, FiPlus } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { BackButton } from '@/components/Reusable_Components/BackButton';
import {
  deleteProduct,
  createCategory,
  getCategories,
  getAllProductsForManagement,
  getUsers,
  importSampleCatalog,
  setProductVisibility,
  type AdminUser,
  type BackendProduct,
} from '@/services/management.services';
import { sampleCatalog } from '@/services/sampleCatalog';
import { formatPrice, getErrorMessage } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  supplier: string;
  price: number;
  category: string;
  isVisible: boolean;
}

const toAdminProduct = (product: BackendProduct): Product => ({
  id: product._id,
  name: product.name,
  supplier: typeof product.supplier === 'string'
    ? product.supplier
    : product.supplier?.name ?? product.supplier?.fullName ?? product.supplier?.email ?? 'Supplier',
  price: product.price,
  category: product.category,
  isVisible: product.isVisible ?? true,
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AdminProductsApprovalManagementPage() {
  const router = useRouter();
  const auth = useAppSelector((state: RootState) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [requestError, setRequestError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingVisibilityId, setUpdatingVisibilityId] = useState<string | null>(null);
  const [isCreatingCategories, setIsCreatingCategories] = useState(false);
  const [categoryMessage, setCategoryMessage] = useState('');
  const [approvedSuppliers, setApprovedSuppliers] = useState<AdminUser[]>([]);
  const [defaultSupplierId, setDefaultSupplierId] = useState('');
  const [supplierAssignments, setSupplierAssignments] = useState<Record<string, string>>({});
  const [isImportingSample, setIsImportingSample] = useState(false);
  const [importMessage, setImportMessage] = useState('');

  useEffect(() => {
    if (!auth.isAuthenticated || auth.user?.role !== 'admin') {
      router.push('/login');
    } else {
      setIsAuthorized(true);
      let active = true;
      getAllProductsForManagement()
        .then((data: BackendProduct[]) => {
          if (active) setProducts(data.map(toAdminProduct));
        })
        .catch((error: unknown) => {
          if (active) setRequestError(getErrorMessage(error, 'Unable to load products.'));
        });
      getUsers()
        .then((users) => {
          if (!active) return;
          const suppliers = users.filter(
            (user) => user.role === 'supplier' && user.status === 'approved' && user.isActive,
          );
          setApprovedSuppliers(suppliers);
          if (suppliers[0]) setDefaultSupplierId((current) => current || suppliers[0]._id);
        })
        .catch((error: unknown) => {
          if (active) setRequestError(getErrorMessage(error, 'Unable to load supplier accounts.'));
        });
      return () => { active = false; };
    }
  }, [auth.isAuthenticated, auth.user?.role, router]);

  if (!isAuthorized) {
    return null;
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    setRequestError('');
    try {
      await deleteProduct(id);
      setProducts((current) => current.filter((product) => product.id !== id));
      setDeletingId(null);
    } catch (error) {
      setRequestError(getErrorMessage(error, 'Unable to delete product.'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleVisibilityChange = async (product: Product) => {
    setUpdatingVisibilityId(product.id);
    setRequestError('');
    try {
      const updatedProduct = await setProductVisibility(product.id, !product.isVisible);
      setProducts((current) => current.map((item) =>
        item.id === product.id
          ? { ...item, isVisible: updatedProduct.isVisible ?? !product.isVisible }
          : item,
      ));
    } catch (error) {
      setRequestError(getErrorMessage(error, 'Unable to update product visibility.'));
    } finally {
      setUpdatingVisibilityId(null);
    }
  };

  const handleCreateCategories = async () => {
    setIsCreatingCategories(true);
    setCategoryMessage('');
    setRequestError('');
    try {
      const desiredCategories = ['Jackets', 'Dresses', 'Shoes', 'Accessories', 'Shirts'];
      const existing = await getCategories();
      const existingNames = new Set(existing.map((category) => category.name.trim().toLowerCase()));
      const missingCategories = desiredCategories.filter(
        (name) => !existingNames.has(name.toLowerCase()),
      );
      for (const name of missingCategories) {
        await createCategory({
          name,
          description: `${name} products`,
        });
      }
      setCategoryMessage(
        missingCategories.length
          ? `Added ${missingCategories.length} product categor${missingCategories.length === 1 ? 'y' : 'ies'}. Suppliers can now select them when listing products.`
          : 'All five sample product categories are already available.',
      );
    } catch (error) {
      setRequestError(getErrorMessage(error, 'Unable to create product categories.'));
    } finally {
      setIsCreatingCategories(false);
    }
  };

  const handleImportSampleCatalog = async () => {
    const assignedProducts = sampleCatalog.map((product) => ({
      ...product,
      supplierId: supplierAssignments[product.brand] || defaultSupplierId,
    }));
    if (assignedProducts.some((product) => !product.supplierId)) {
      setRequestError('Assign each product brand to an active, approved supplier before importing.');
      return;
    }

    setIsImportingSample(true);
    setImportMessage('');
    setRequestError('');
    try {
      const result = await importSampleCatalog(assignedProducts);
      const refreshedProducts = await getAllProductsForManagement();
      setProducts(refreshedProducts.map(toAdminProduct));
      setImportMessage(
        `Catalog import complete: ${result.created} added, ${result.reassigned} reassigned to the selected suppliers, ${result.unchanged} already assigned.`,
      );
    } catch (error) {
      setRequestError(getErrorMessage(error, 'Unable to import the sample catalog.'));
    } finally {
      setIsImportingSample(false);
    }
  };

  const sampleBrands = [...new Set(sampleCatalog.map((product) => product.brand))];

  return (
    <main className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <BackButton fallbackHref="/admin/dashboard" />
          <h1 className="text-4xl font-bold mb-2">Product Management</h1>
          <p className="text-muted-foreground">View and manage listed products</p>
        </motion.div>

        {requestError && <p role="alert" className="mb-6 text-sm text-destructive">{requestError}</p>}
        <section className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Sample catalog categories</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Add any missing categories needed for the sample products.
            </p>
            {categoryMessage && <p role="status" className="mt-2 text-sm text-green-700">{categoryMessage}</p>}
          </div>
          <button
            type="button"
            onClick={() => void handleCreateCategories()}
            disabled={isCreatingCategories}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold transition hover:bg-muted disabled:cursor-wait disabled:opacity-60"
          >
            <FiPlus className="h-4 w-4" />
            {isCreatingCategories ? 'Adding categories...' : 'Add sample categories'}
          </button>
        </section>
        <section className="mb-8 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="font-semibold">Import the sample product catalog</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Import {sampleCatalog.length} listings directly into the database. Missing sample categories are created automatically. Assign each sample brand to one of your approved supplier accounts; supplier sign-in is not required.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Images use the supplied URLs. Sample ratings and review counts are demo values and do not create customer review records.
            </p>
            {importMessage && <p role="status" className="mt-2 text-sm text-green-700">{importMessage}</p>}
          </div>
          {approvedSuppliers.length === 0 ? (
            <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              No active, approved supplier accounts are available. Approve a supplier first.
            </p>
          ) : (
            <>
              <label className="mb-4 block max-w-xl text-sm font-medium">
                Default supplier for sample brands
                <select
                  value={defaultSupplierId}
                  onChange={(event) => setDefaultSupplierId(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5"
                >
                  {approvedSuppliers.map((supplier) => (
                    <option key={supplier._id} value={supplier._id}>
                      {supplier.fullName} ({supplier.email})
                    </option>
                  ))}
                </select>
              </label>
              <details className="mb-5 rounded-lg border border-border p-4">
                <summary className="cursor-pointer text-sm font-medium">
                  Assign individual brands to different suppliers
                </summary>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {sampleBrands.map((brand) => (
                    <label key={brand} className="text-sm">
                      {brand}
                      <select
                        value={supplierAssignments[brand] || defaultSupplierId}
                        onChange={(event) => setSupplierAssignments((current) => ({
                          ...current,
                          [brand]: event.target.value,
                        }))}
                        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                      >
                        {approvedSuppliers.map((supplier) => (
                          <option key={supplier._id} value={supplier._id}>
                            {supplier.fullName}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
              </details>
              <button
                type="button"
                onClick={() => void handleImportSampleCatalog()}
                disabled={isImportingSample || !defaultSupplierId}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
              >
                <FiPlus className="h-4 w-4" />
                {isImportingSample ? 'Importing products...' : `Import ${sampleCatalog.length} sample products`}
              </button>
            </>
          )}
        </section>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 space-y-4"
        >
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        </motion.div>

        {/* Products Table */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="overflow-hidden rounded-lg border border-border bg-card shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary">
                  <th className="px-6 py-4 text-left text-sm font-semibold">Product Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Supplier</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <motion.tr
                    key={product.id}
                    variants={itemVariants}
                    className="border-b border-border hover:bg-secondary transition"
                  >
                    <td className="px-6 py-4 font-medium">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{product.supplier}</td>
                    <td className="px-6 py-4 font-semibold">{formatPrice(product.price)}</td>
                    <td className="px-6 py-4 text-sm">{product.category}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.isVisible
                          ? 'bg-green-100 text-green-800'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {product.isVisible ? 'Listed' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <motion.button
                        type="button"
                        onClick={() => void handleVisibilityChange(product)}
                        disabled={updatingVisibilityId === product.id}
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.92 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        className="group rounded p-2 text-primary transition-colors hover:bg-primary/10 hover:text-primary disabled:cursor-wait disabled:opacity-50"
                        aria-label={`${product.isVisible ? 'Hide' : 'Show'} ${product.name} in marketplace`}
                        title={`${product.isVisible ? 'Hide' : 'Show'} in marketplace`}
                      >
                        <FiEye className={`h-4 w-4 transition-transform duration-200 group-hover:scale-125 ${product.isVisible ? '' : 'opacity-50'}`} />
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={() => setDeletingId(product.id)}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.94 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        className="rounded p-2 text-destructive transition-colors hover:bg-destructive/10"
                        aria-label={`Delete ${product.name}`}
                        title="Delete product"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-muted-foreground">
                      {products.length ? 'No products match your search.' : 'No products have been listed yet.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Delete Confirmation */}
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card rounded-lg shadow-xl max-w-sm w-full mx-4 p-6 border border-border"
            >
              <h3 className="text-lg font-bold mb-2">Delete Product</h3>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to remove this product from the platform? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingId(null)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deletingId && void handleDelete(deletingId)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-destructive text-white rounded-lg hover:opacity-90 transition"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
}
