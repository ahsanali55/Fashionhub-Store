'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi';
import { useAppSelector } from '@/hooks/redux';
import { RootState } from '@/redux/store';
import { getCategories } from '@/services/management.services';
import { useEffect, useState } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45 },
  },
};

export default function CategoriesPage() {
  const products = useAppSelector((state: RootState) => state.products);
  const [categoriesFromApi, setCategoriesFromApi] = useState<Array<{ _id: string; name: string }>>([]);
  const [requestError, setRequestError] = useState('');

  useEffect(() => {
    getCategories()
      .then(setCategoriesFromApi)
      .catch((error: unknown) => {
        setRequestError(error instanceof Error ? error.message : 'Unable to load categories.');
      });
  }, []);

  const categoryMap = products.items.reduce((acc, product) => {
    const key = product.category.toLowerCase();
    if (!acc[key]) {
      acc[key] = { count: 0, image: product.image };
    }
    acc[key].count += 1;
    return acc;
  }, {} as Record<string, { count: number; image: string }>);

  const categories = categoriesFromApi.map(({ name }) => {
    const key = name.toLowerCase();
    const productData = categoryMap[key];
    return {
      name,
      slug: name,
      count: productData?.count ?? 0,
      image: productData?.image ?? '/placeholder.svg',
    };
  });

  return (
    <main className="bg-background min-h-screen relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-16 relative">
        {/* Header - matches WhyChooseUs / TestimonialsSection pattern */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl text-left mb-14"
        >
          <motion.span
            variants={itemVariants}
            className="inline-block text-sm font-semibold tracking-[0.18em] uppercase text-primary mb-3"
          >
            Explore
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4"
          >
            Shop by <span className="text-primary">category.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-4 max-w-xl text-base leading-7 text-muted-foreground"
          >
            Browse our complete collection, organized by category, updated live from every listed product.
          </motion.p>
        </motion.div>

        {requestError && <p role="alert" className="mb-6 text-sm text-destructive">{requestError}</p>}

        {/* Categories Grid - matches homepage Categories.tsx card style */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {categories.map((category) => (
            <motion.div key={category.slug} variants={itemVariants}>
              <Link
                href={`/shop?category=${category.slug}`}
                className="group relative block h-[280px] overflow-hidden rounded-2xl bg-muted sm:h-[320px]"
              >
                {/* Image */}
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Bottom Gradient */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">{category.name}</h2>
                    <p className="mt-1 text-sm text-white/70">
                      {category.count} {category.count === 1 ? 'item' : 'items'}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                    <FiArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CTA Section - matches CTASection styling */}
      <section className="py-20 px-4 sm:px-6 bg-background border-t border-border relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Use our search feature to discover exactly what you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="flex items-center justify-center gap-2 px-8 py-4 text-white font-bold rounded-lg hover:bg-primary/90 bg-primary transition-colors duration-300 w-50"
            >
              Go to Shop
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}