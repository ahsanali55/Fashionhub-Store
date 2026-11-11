'use client';

import { motion } from 'framer-motion';
import { FiUser, FiPackage, FiShield, FiTruck, FiLock, FiTrendingUp } from 'react-icons/fi';

interface RoleQuote {
  id: number;
  role: 'Customer' | 'Supplier' | 'Admin';
  icon: React.ElementType;
  quote: string;
  context: string;
}
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
const roleQuotes: RoleQuote[] = [
  {
    id: 1,
    role: 'Customer',
    icon: FiUser,
    quote: 'Browsing by category and tracking my order status is straightforward from start to finish.',
    context: 'Shopping experience',
  },
  {
    id: 2,
    role: 'Customer',
    icon: FiTruck,
    quote: 'Cash on delivery with a clear order history means no surprises at checkout.',
    context: 'Checkout & orders',
  },
  {
    id: 3,
    role: 'Supplier',
    icon: FiPackage,
    quote: 'Adding and managing products takes minutes, not a back-and-forth with support.',
    context: 'Product management',
  },
  {
    id: 4,
    role: 'Supplier',
    icon: FiTrendingUp,
    quote: 'Sales analytics give a real picture of what is moving and what is not.',
    context: 'Performance tracking',
  },
  {
    id: 5,
    role: 'Admin',
    icon: FiShield,
    quote: 'Reviewing and approving new suppliers before they go live keeps the marketplace trustworthy.',
    context: 'Supplier approval',
  },
  {
    id: 6,
    role: 'Admin',
    icon: FiLock,
    quote: 'Every order, user, and report is visible from one dashboard, not scattered across tools.',
    context: 'Platform oversight',
  },
];

const roleStyles: Record<RoleQuote['role'], { icon: string; dot: string }> = {
  Customer: { icon: 'bg-primary text-primary-foreground', dot: 'bg-primary' },
  Supplier: { icon: 'bg-secondary text-secondary-foreground', dot: 'bg-secondary' },
  Admin: { icon: 'bg-accent-foreground text-white', dot: 'bg-accent-foreground' },
};

function QuoteCard({ item }: { item: RoleQuote }) {
  const Icon = item.icon;
  const style = roleStyles[item.role];
  return (
    <div className="flex-shrink-0 w-80 rounded-2xl border border-border bg-card px-6 py-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
      <p className="text-sm text-foreground leading-relaxed mb-5 min-h-[60px]">
        {item.quote}
      </p>

      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${style.icon}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
            <p className="font-semibold text-foreground text-sm leading-tight">{item.role}</p>
          </div>
          <p className="text-xs text-muted-foreground leading-tight truncate">{item.context}</p>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const rowTop = [...roleQuotes, ...roleQuotes];
  const rowBottom = [...roleQuotes.slice(3), ...roleQuotes.slice(0, 3), ...roleQuotes.slice(3), ...roleQuotes.slice(0, 3)];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
  
      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
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
            Platform Voices
          </motion.span>

          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4"
          >
            What every role <span className="text-primary">experiences.</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-4 max-w-xl text-base leading-7 text-muted-foreground"
          >
            FashionHub works differently depending on who you are. Here is what it looks like from each side.
          </motion.p>
        </motion.div>

        {/* Marquee rows */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="overflow-hidden mb-4">
            <div className="flex gap-4 w-max animate-marquee-left">
              {rowTop.map((item, idx) => (
                <QuoteCard key={`top-${item.id}-${idx}`} item={item} />
              ))}
            </div>
          </div>

          <div className="overflow-hidden">
            <div className="flex gap-4 w-max animate-marquee-right">
              {rowBottom.map((item, idx) => (
                <QuoteCard key={`bottom-${item.id}-${idx}`} item={item} />
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20 text-center"
        >
          <div className="group flex flex-col items-center cursor-pointer">
            <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105">
              <FiUser className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-foreground">3 Roles</p>
            <p className="text-muted-foreground mt-1">Customer, Supplier & Admin</p>
          </div>
          <div className="group flex flex-col items-center cursor-pointer">
            <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105">
              <FiShield className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-foreground">Verified</p>
            <p className="text-muted-foreground mt-1">Suppliers reviewed before listing</p>
          </div>
          <div className="group flex flex-col items-center cursor-pointer">
            <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105">
              <FiLock className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-foreground">Secure COD</p>
            <p className="text-muted-foreground mt-1">Protected checkout, every order</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}