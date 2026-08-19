import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowUpRight } from 'react-icons/fi';

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
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
    },
  },
};

const categories = [
  {
    name: 'Jackets',
    count: '234 items',
    image:
      'https://images.unsplash.com/photo-1727515192207-3dc860bfd773?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Dresses',
    count: '456 items',
    image:
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Shoes',
    count: '567 items',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Sweaters',
    count: '189 items',
    image:
      'https://plus.unsplash.com/premium_photo-1673125287084-e90996bad505?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Accessories',
    count: '345 items',
    image:
      'https://images.unsplash.com/photo-1604306354577-68136efdf03b?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Shirts',
    count: '123 items',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop',
  },
];

export default function Categories() {
  return (
    <section className="bg-background pt-20 md:pt-24 px-4 sm:px-6 ">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <motion.span
              variants={itemVariants}
              className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-primary"
            >
              Explore
            </motion.span>

            <motion.h2
              variants={itemVariants}

              className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4"
            >
              Shop by category
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="mt-4 max-w-xl text-base leading-7 text-muted-foreground"
            >
              Discover clothing and accessories from our collection of
              carefully selected categories.
            </motion.p>
          </div>

          <motion.div variants={itemVariants}>
            <Link
              href="/categories"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
            >
              View all categories
              <FiArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {categories.map((category) => (
            <motion.div
              key={category.name}
              variants={itemVariants}
            >
              <Link
                href={`/categories?category=${category.name.toLowerCase()}`}
                className="group relative block h-[280px] overflow-hidden rounded-2xl bg-muted sm:h-[320px]"
              >
                {/* Image */}
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="
                    absolute inset-0
                    h-full w-full
                    object-cover
                    transition-transform duration-700
                    ease-out
                    group-hover:scale-105
                  "
                />

                {/* Bottom Gradient */}
                <div
                  className="
                    absolute inset-x-0 bottom-0 h-1/2
                    bg-gradient-to-t
                    from-black/80
                    via-black/30
                    to-transparent
                  "
                />

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {category.name}
                    </h3>

                    <p className="mt-1 text-sm text-white/70">
                      {category.count}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div
                    className="
                      flex h-10 w-10
                      items-center justify-center
                      rounded-full
                      bg-white/10
                      text-white
                      backdrop-blur-md
                      transition-all duration-300
                      group-hover:bg-primary
                      group-hover:text-white
                    "
                  >
                    <FiArrowUpRight
                      className="
                        h-5 w-5
                        transition-transform duration-300
                        group-hover:translate-x-0.5
                        group-hover:-translate-y-0.5
                      "
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}