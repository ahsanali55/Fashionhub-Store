import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowUpRight } from 'react-icons/fi';
import { useAppSelector } from '@/hooks/redux';
import { RootState } from '@/redux/store';
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

export default function Categories() {
  const products = useAppSelector((state: RootState) => state.products);
  
    const categoryMap = products.items.reduce((acc, product) => {
      const key = product.category;
      if (!acc[key]) {
        acc[key] = { count: 0, image: product.image };
      }
      acc[key].count += 1;
      return acc;
    }, {} as Record<string, { count: number; image: string }>);
  
    const categories = Object.entries(categoryMap).map(([name, data]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      slug: name,
      count: data.count,
      image: data.image,
    }));
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
              Shop by   <span className="text-primary">
              category  </span>

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
                href={`/shop?category=${category.slug}`}
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