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
import { addToCart } from '@/redux/slices/cartSlice';
import { addToWishlist } from '@/redux/slices/wishlistSlice';
import { useAppDispatch } from '@/hooks/redux';
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
  const categoryFromUrl = searchParams.get('category');
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('search') || ''
  );

  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || 'All');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [FilterOpen, setFilterOpen] = useState(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);
  const categories = [
    { label: 'All', value: 'all' },
    ...Array.from(
      new Map(
        products.items.map((product) => [
          product.category.toLowerCase(),
          product.category,
        ]),
      ),
    ).map(([value, label]) => ({ label, value })),
  ];

  const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-low' },
    { label: 'Price: High to Low', value: 'price-high' },
    { label: 'Top Rated', value: 'rating' },
  ];

  const priceOptions = [
    { label: 'All Prices', value: 'all' },
    { label: 'Under PKR 5,000', value: 'under-5000' },
    { label: 'PKR 5,000 – 10,000', value: '5000-10000' },
    { label: 'PKR 10,000 – 20,000', value: '10000-20000' },
    { label: 'PKR 20,000 – 30,000', value: '20000-30000' },
    { label: 'PKR 30,000+', value: '30000-plus' },
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
        case 'under-5000':
          matchesPrice = product.price < 5000;
          break;

        case '5000-10000':
          matchesPrice =
            product.price >= 5000 &&
            product.price <= 10000;
          break;

        case '10000-20000':
          matchesPrice =
            product.price > 10000 &&
            product.price <= 20000;
          break;

        case '20000-30000':
          matchesPrice =
            product.price > 20000 &&
            product.price <= 30000;
          break;

        case '30000-plus':
          matchesPrice = product.price > 30000;
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
  };

  const handleCategoryChange = (category: string) => {
    setCurrentPage(1);

    const params = new URLSearchParams(searchParams.toString());

    if (category !== 'all') {
      params.set('category', category);
    } else {
      params.delete('category');
    }

    params.delete('page');

    router.replace(`/shop?${params.toString()}`, { scroll: false });
  };
  useEffect(() => {
    setSelectedCategory(categoryFromUrl || 'all');
  }, [categoryFromUrl]);

  const handlePriceChange = (price: string) => {
    setPriceRange(price);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setFilterOpen(false);
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
    router.replace(`/shop`, { scroll: false });
  };
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    } else {
      params.delete('page');
    }
    router.replace(`/shop?${params.toString()}`, { scroll: false });
  }, [currentPage]);

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
                handleSearchChange(value);
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
   <div className="mb-10">
  <div className="flex flex-col gap-4">

    {/* Top row */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

      {/* Categories */}
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-3">
          <FiFilter size={16} />
          <span className="text-sm font-semibold">
            Category
          </span>
        </div>

        {/* Mobile = horizontal scroll | Desktop = wrap */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide sm:flex-wrap sm:overflow-visible">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() =>
                handleCategoryChange(category.value)
              }
              className={`
                shrink-0
                px-4
                py-2
                rounded-full
                text-sm
                font-medium
                transition
                cursor-pointer
                border
                whitespace-nowrap

                ${
                  selectedCategory === category.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border hover:border-primary hover:text-primary'
                }
              `}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="relative shrink-0 self-end sm:self-auto">

        <button
          onClick={() => setFilterOpen(!FilterOpen)}
          className="
            h-11
            px-4
            rounded-xl
            border
            border-border
            bg-card
            flex
            items-center
            gap-2.5
            text-sm
            font-semibold
            hover:border-primary/50
            transition
            cursor-pointer
          "
        >
          <FiFilter size={17} />

          <span>Filters</span>

          {/* Active indicator */}
          {(priceRange !== 'all' || sortBy !== 'newest') && (
            <span className="w-2 h-2 rounded-full bg-primary" />
          )}

          <FiChevronDown
            size={15}
            className={`
              transition-transform
              ${FilterOpen ? 'rotate-180' : ''}
            `}
          />
        </button>

        {/* Filter Popup */}
        {FilterOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.15 }}
            className="
              absolute
              right-0
              top-14
              z-40

              w-[calc(100vw-2rem)]
              max-w-sm

              sm:w-80

              rounded-2xl
              border
              border-border
              bg-card
              shadow-xl
              overflow-hidden
            "
          >

            {/* Popup content */}
            <div className="p-5">

              {/* Price */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold">
                    Price
                  </span>

                  {priceRange !== 'all' && (
                    <button
                      onClick={() => handlePriceChange('all')}
                      className="
                        text-xs
                        text-primary
                        hover:underline
                      "
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  {priceOptions.map((price) => {
                    const isActive =
                      priceRange === price.value;

                    return (
                      <button
                        key={price.value}
                        onClick={() =>
                          handlePriceChange(price.value)
                        }
                        className={`
                          w-full
                          flex
                          items-center
                          justify-between
                          px-3
                          py-2.5
                          rounded-lg
                          text-sm
                          text-left
                          transition

                          ${
                            isActive
                              ? 'bg-primary/10 text-primary font-semibold'
                              : 'hover:bg-muted text-foreground'
                          }
                        `}
                      >
                        <span>{price.label}</span>

                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-border my-5" />

              {/* Sort */}
              <div>
                <span className="text-sm font-semibold block mb-3">
                  Sort by
                </span>

                <div className="space-y-1">
                  {sortOptions.map((option) => {
                    const isActive =
                      sortBy === option.value;

                    return (
                      <button
                        key={option.value}
                        onClick={() =>
                          handleSortChange(option.value)
                        }
                        className={`
                          w-full
                          flex
                          items-center
                          justify-between
                          px-3
                          py-2.5
                          rounded-lg
                          text-sm
                          text-left
                          transition

                          ${
                            isActive
                              ? 'bg-primary/10 text-primary font-semibold'
                              : 'hover:bg-muted text-foreground'
                          }
                        `}
                      >
                        <span>{option.label}</span>

                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Clear filters */}
            {(priceRange !== 'all' || sortBy !== 'newest') && (
              <div className="border-t border-border">
                <button
                  onClick={() => {
                    setPriceRange('all');
                    setSortBy('newest');
                    setFilterOpen(false);
                  }}
                  className="
                    w-full
                    px-5
                    py-3.5
                    text-sm
                    font-semibold
                    text-muted-foreground
                    hover:text-primary
                    hover:bg-muted
                    transition
                  "
                >
                  Clear all filters
                </button>
              </div>
            )}

          </motion.div>
        )}
      </div>

    </div>
  </div>
</div>

        {/* ================= RESULT INFO ================= */}
        {products.loading && (
          <p role="status" className="mb-6 text-sm text-muted-foreground">
            Loading products...
          </p>
        )}
        {products.error && (
          <p role="alert" className="mb-6 text-sm text-destructive">
            Unable to load products: {products.error}
          </p>
        )}
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
                <ProductCard
                  product={product}
                  onAddToCart={() => dispatch(addToCart({ ...product, quantity: 1, })
                  )}
                  onAddToWishlist={() => dispatch(addToWishlist(product))}
                />
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