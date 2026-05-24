'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

interface HeroProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaLink?: string;
  showTransparentNavbar?: boolean;
}

export function HeroSection({
  title,
  subtitle,
  backgroundImage = '/hero-fashion.jpg',
  ctaText = 'Shop Now',
  ctaLink = '/shop',
  showTransparentNavbar = true,
}: HeroProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Reduced fade for light mode - much lighter now */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
      </div>

      {/* Hero Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6"
      >
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold text-white mb-6 text-balance leading-tight">
          {title}
        </motion.h1>

        <motion.p variants={itemVariants} className="text-lg md:text-xl text-white/90 mb-8 text-balance max-w-2xl mx-auto">
          {subtitle}
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={ctaLink}
            className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition font-semibold flex items-center gap-2 group"
          >
            {ctaText}
            <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </Link>
          <Link
            href="/shop"
            className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-black transition font-semibold"
          >
            Explore All
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white z-20"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
}
