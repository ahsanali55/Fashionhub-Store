'use client';

import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { filterByCategory, searchProducts } from '@/lib/slices/productsSlice';
import { ProductCard } from '@/components/ProductCard';
import { FiFilter } from 'react-icons/fi';
import { useState } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function ShopPage() {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  const categories = ['all', 'jackets', 'dresses', 'shoes', 'sweaters', 'accessories', 'shirts', 'bags'];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    dispatch(searchProducts(term));
  };

  const handleCategoryFilter = (category: string) => {
    dispatch(filterByCategory(category));
  };

  return (
    <main className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-secondary border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-4xl font-bold">Shop Our Collection</h1>
            <p className="text-muted-foreground">Discover premium fashion from suppliers worldwide</p>

            {/* Search Bar */}
            <div className="flex gap-2 mt-6">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearch}
                className="flex-1 px-4 py-3 rounded-lg bg-white border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${filterOpen ? 'block' : 'hidden'} md:block w-full md:w-64 mb-8 md:mb-0`}
          >
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <FiFilter className="w-5 h-5" />
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryFilter(cat)}
                      className={`w-full text-left px-4 py-2 rounded-lg capitalize transition ${
                        products.selectedCategory === cat
                          ? 'bg-primary text-white'
                          : 'bg-secondary hover:bg-border'
                      }`}
                    >
                      {cat === 'all' ? 'All Products' : cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="flex-1">
            {products.filtered.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No products found.</p>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {products.filtered.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Results Count */}
            <div className="mt-12 text-center text-muted-foreground">
              <p>Showing {products.filtered.length} products</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
