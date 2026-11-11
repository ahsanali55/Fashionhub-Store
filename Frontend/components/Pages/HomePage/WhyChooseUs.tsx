import { FiCheck, FiHeart, FiShield, FiTruck } from 'react-icons/fi';
import { motion } from 'framer-motion';

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

const whyChoose = [
  {
    icon: FiTruck,
    title: 'Reliable Delivery',
    description: 'Orders reach customers safely and on time.',
  },
  {
    icon: FiShield,
    title: 'Secure Checkout',
    description: 'Transactions are protected with proper security.',
  },
  {
    icon: FiCheck,
    title: 'Verified Products',
    description: 'Shop items from trusted fashion suppliers.',
  },
  {
    icon: FiHeart,
    title: 'Wishlist & Favorites',
    description: 'Save products you love for later.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="pt-20 md:pt-24 px-4 sm:px-6 bg-background">
      <div className="max-w-7xl mx-auto">

        {/* Section Heading */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="max-w-2xl text-left mb-14"
        >
          <motion.span
            variants={itemVariants}
            className="inline-block text-sm font-semibold tracking-[0.18em] uppercase text-primary mb-3"
          >
            Why FashionHub
          </motion.span>

          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4"
          >
            Better <span className="text-primary">shopping experience.</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-4 max-w-xl text-base leading-7 text-muted-foreground"
          >
            Simple, secure, and convenient shopping from trusted suppliers.
          </motion.p>
        </motion.div>

        {/* Features */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {whyChoose.map((item) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="group relative p-7 bg-card border border-border rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                {/* Icon */}
                <div
                  className="
                    w-12 h-12
                    rounded-xl
                    bg-primary/10
                    text-primary
                    flex items-center justify-center
                    mb-5
                    transition-all duration-300
                    group-hover:bg-primary
                    group-hover:text-primary-foreground
                    group-hover:scale-105
                  "
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <h3 className="text-base font-bold text-foreground mb-2">
                  {item.title}
                </h3>

                <p className="text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}