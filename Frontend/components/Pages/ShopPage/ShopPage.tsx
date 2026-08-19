'use client';

import { motion } from 'framer-motion';
import { useMemo, useState, useEffect } from 'react';
import {
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';

import { ProductCard } from '@/components/Pages/ShopPage/ProductCard';
import { RootState } from '@/redux/store';
import { useAppSelector } from '@/hooks/redux';
import { useRouter, useSearchParams } from 'next/navigation';
const PRODUCTS_PER_PAGE = 8;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 15,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
    },
  },
};

export default function ShopPage() {
  const products = useAppSelector((state: RootState) => state.products);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('search') || ''
  );
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOpen, setSortOpen] = useState(false);
  useEffect(() => {
        setSearchTerm(searchParams.get('search') || '');
      }, [searchParams]);
  const categories = [
    { label: 'All', value: 'all' },
    { label: 'Jackets', value: 'jackets' },
    { label: 'Dresses', value: 'dresses' },
    { label: 'Shoes', value: 'shoes' },
    { label: 'Accessories', value: 'accessories' },
    { label: 'Shirts', value: 'shirts' },
  ];

  const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-low' },
    { label: 'Price: High to Low', value: 'price-high' },
    { label: 'Top Rated', value: 'rating' },
  ];

  const priceOptions = [
    { label: 'All Prices', value: 'all' },
    { label: 'Under $75', value: 'under-75' },
    { label: '$75 – $125', value: '75-125' },
    { label: '$125 – $175', value: '125-175' },
    { label: '$175+', value: '175-plus' },
  ];

  /*
   * Filter + sort products
   */
  const filteredProducts = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    const result = products.items.filter((product) => {
      /*
       * Search by:
       * - product name
       * - category
       * - supplier/brand
       * - description
       */
      const matchesSearch =
        search === '' ||
        product.name.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search) ||
        product.supplier.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search);

      /*
       * Category
       */
      const matchesCategory =
        selectedCategory === 'all' ||
        product.category.toLowerCase() === selectedCategory.toLowerCase();

      /*
       * Price
       */
      let matchesPrice = true;

      switch (priceRange) {
        case 'under-75':
          matchesPrice = product.price < 75;
          break;

        case '75-125':
          matchesPrice = product.price >= 75 && product.price <= 125;
          break;

        case '125-175':
          matchesPrice = product.price > 125 && product.price <= 175;
          break;

        case '175-plus':
          matchesPrice = product.price > 175;
          break;

        default:
          matchesPrice = true;
      }

      return matchesSearch && matchesCategory && matchesPrice;
    });

    /*
     * Sorting
     */
    return [...result].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;

        case 'price-high':
          return b.price - a.price;

        case 'rating':
          return (b.rating || 0) - (a.rating || 0);

        case 'newest':
        default:
          return Number(b.id) - Number(a.id);
      }
    });
  }, [
    products.items,
    searchTerm,
    selectedCategory,
    priceRange,
    sortBy,
  ]);

  /*
   * Pagination
   */
  const totalPages = Math.ceil(
    filteredProducts.length / PRODUCTS_PER_PAGE
  );

  const paginatedProducts = useMemo(() => {
    const startIndex =
      (currentPage - 1) * PRODUCTS_PER_PAGE;

    return filteredProducts.slice(
      startIndex,
      startIndex + PRODUCTS_PER_PAGE
    );
  }, [filteredProducts, currentPage]);

  /*
   * Reset pagination whenever filters change
   */
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePriceChange = (price: string) => {
    setPriceRange(price);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setSortOpen(false);
    setCurrentPage(1);
  };

  /*
   * Clear everything
   */
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange('all');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const currentSortLabel =
    sortOptions.find((option) => option.value === sortBy)?.label ||
    'Newest';

  return (
    <main className="min-h-screen bg-background pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-3">
            FashionHub Collection
          </p>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Shop
          </h1>

          <p className="mt-3 text-muted-foreground max-w-xl">
            Discover premium fashion from our trusted suppliers.
          </p>
        </motion.div>

        {/* ================= SEARCH ================= */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative max-w-2xl">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={19}
            />

            <input
              type="text"
              placeholder="Search by product, category, supplier..."
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerm(value);

                const params = new URLSearchParams(searchParams.toString());

                if (value.trim()) {
                  params.set('search', value);
                } else {
                  params.delete('search');
                }

                params.delete('page');

                router.replace(`/shop?${params.toString()}`, {
                  scroll: false,
                });
              }}
              className="
                w-full
                h-12
                pl-11
                pr-4
                rounded-xl
                bg-card
                border
                border-border
                text-sm
                outline-none
                transition
                focus:border-primary
                focus:ring-2
                focus:ring-primary/10
              "
            />
          </div>
        </motion.div>

        {/* ================= FILTER BAR ================= */}
        <div className="flex flex-col gap-5 mb-10">

          {/* Categories */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FiFilter size={16} />
              <span className="text-sm font-semibold">
                Category
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() =>
                    handleCategoryChange(category.value)
                  }
                  className={`
                    px-4
                    py-2
                    rounded-full
                    text-sm
                    font-medium
                    transition
                    border
                    ${selectedCategory === category.value
                      ? 'bg-primary text-white border-primary'
                      : 'bg-card border-border hover:border-primary hover:text-primary'
                    }
                  `}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price + Sort */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">

            {/* Price */}
            <div className="flex flex-wrap gap-2">
              {priceOptions.map((price) => (
                <button
                  key={price.value}
                  onClick={() =>
                    handlePriceChange(price.value)
                  }
                  className={`
                    px-3
                    py-2
                    rounded-lg
                    text-sm
                    transition
                    border
                    ${priceRange === price.value
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-border bg-card hover:border-primary'
                    }
                  `}
                >
                  {price.label}
                </button>
              ))}
            </div>

            {/* Custom Sort Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="
                  h-10
                  min-w-[190px]
                  px-4
                  rounded-lg
                  border
                  border-border
                  bg-card
                  flex
                  items-center
                  justify-between
                  gap-3
                  text-sm
                  font-medium
                  hover:border-primary
                  transition
                "
              >
                <span>{currentSortLabel}</span>

                <FiChevronDown
                  className={`transition-transform ${sortOpen ? 'rotate-180' : ''
                    }`}
                />
              </button>

              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="
                    absolute
                    right-0
                    top-12
                    z-30
                    w-full
                    min-w-[190px]
                    rounded-lg
                    border
                    border-border
                    bg-card
                    shadow-lg
                    overflow-hidden
                  "
                >
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        handleSortChange(option.value)
                      }
                      className={`
                        w-full
                        px-4
                        py-2.5
                        text-left
                        text-sm
                        transition
                        ${sortBy === option.value
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'hover:bg-muted'
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* ================= RESULT INFO ================= */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Showing{' '}
            <span className="font-semibold text-foreground">
              {paginatedProducts.length}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-foreground">
              {filteredProducts.length}
            </span>{' '}
            products
          </p>

          {(searchTerm ||
            selectedCategory !== 'all' ||
            priceRange !== 'all') && (
              <button
                onClick={clearFilters}
                className="text-sm font-medium text-primary hover:underline"
              >
                Clear filters
              </button>
            )}
        </div>

        {/* ================= PRODUCTS ================= */}
        {paginatedProducts.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-x-5
              gap-y-8
            "
          >
            {paginatedProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* ================= EMPTY STATE ================= */
          <div className="py-24 text-center">
            <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-muted flex items-center justify-center">
              <FiSearch size={22} />
            </div>

            <h2 className="text-xl font-semibold mb-2">
              No products found
            </h2>

            <p className="text-muted-foreground text-sm mb-5">
              Try changing your search or filters.
            </p>

            <button
              onClick={clearFilters}
              className="
                px-5
                py-2.5
                rounded-lg
                bg-primary
                text-white
                text-sm
                font-semibold
                hover:opacity-90
                transition
              "
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* ================= PAGINATION ================= */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-14">

            {/* Previous */}
            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((page) => page - 1)
              }
              className="
                w-10
                h-10
                rounded-lg
                border
                border-border
                bg-card
                flex
                items-center
                justify-center
                transition
                disabled:opacity-40
                disabled:cursor-not-allowed
                hover:border-primary
              "
              aria-label="Previous page"
            >
              <FiChevronLeft size={18} />
            </button>

            {/* Pages */}
            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`
                  w-10
                  h-10
                  rounded-lg
                  text-sm
                  font-semibold
                  transition
                  ${currentPage === page
                    ? 'bg-primary text-white'
                    : 'border border-border bg-card hover:border-primary hover:text-primary'
                  }
                `}
              >
                {page}
              </button>
            ))}

            {/* Next */}
            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((page) => page + 1)
              }
              className="
                w-10
                h-10
                rounded-lg
                border
                border-border
                bg-card
                flex
                items-center
                justify-center
                transition
                disabled:opacity-40
                disabled:cursor-not-allowed
                hover:border-primary
              "
              aria-label="Next page"
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        )}

      </div>
    </main>
  );
}