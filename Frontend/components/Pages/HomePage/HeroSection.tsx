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
  backgroundImage = 'https://media.istockphoto.com/id/488178539/photo/brand-new-interior-of-cloth-store.jpg?s=2048x2048&w=is&k=20&c=hdbKZLJxyhbjVyOVrZh3FC0p_pW1xdl54y-y7tjNeEs=',
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
            backgroundImage: 'url(https://media.istockphoto.com/id/488178539/photo/brand-new-interior-of-cloth-store.jpg?s=2048x2048&w=is&k=20&c=hdbKZLJxyhbjVyOVrZh3FC0p_pW1xdl54y-y7tjNeEs=)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
        </div>

        {/* Hero Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10  text-center max-w-4xl mx-auto px-4 sm:px-6"
        >
          <motion.div
            variants={itemVariants}
            className="inline-block px-4 py-2 bg-accent/20 border border-accent rounded-full mb-6 backdrop-blur-sm "
          >
            <span className="text-accent font-semibold text-sm">Welcome to FashionHub</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white text-balance leading-tight mb-6"
          >
            Premium Fashion,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-emerald-300">
              Limitless Style
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-12"
          >
            Discover curated collections from world-class suppliers. Elevate your wardrobe with premium quality and exclusive designs.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link
              href="/shop"
              className="px-8 py-4 bg-accent text-black font-bold rounded-lg hover:opacity-90 transition flex items-center gap-2 group"
            >
              Shop Now
              <FiArrowRight className="group-hover:translate-x-1 transition" />
            </Link>
            <Link
              href="/categories"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-black transition"
            >
              Explore Collections
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white opacity-60"
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-center justify-center">
            <div className="w-1 h-2 bg-white rounded-full" />
          </div>
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
