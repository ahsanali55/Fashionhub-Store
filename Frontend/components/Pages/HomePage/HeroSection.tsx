'use client';

import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
// Added FiChevronDown for the new scroll indicator
import { FiArrowRight, FiChevronDown } from 'react-icons/fi';

interface HeroProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaLink?: string;
}

export function HeroSection({
  title = 'Premium Fashion.',
  subtitle = 'Discover quality fashion from trusted suppliers and find your next favorite look.',
backgroundImage = 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop',
  ctaText = 'Shop Now',
  ctaLink = '/shop',
}: HeroProps) {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: 'easeOut',
      },
    },
  };

  // Function to smoothly scroll down when the indicator is clicked
  const scrollToNextSection = () => {
    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    // Changed to min-h-screen so it covers the entire viewport height
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* ==========================================
          Background Image
          ========================================== */}

      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* ==========================================
          Image Overlay
          ========================================== */}

      <div className="absolute inset-0 bg-black/45" />

      {/* Left-to-right gradient for readable text */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />

      {/* ==========================================
          Hero Content
          ========================================== */}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="
          relative z-10
          w-full
          max-w-7xl
          mx-auto
          px-4 sm:px-6 lg:px-8
          py-24
        "
      >
        <div className="max-w-3xl">

          {/* Small Brand Label */}

          <motion.div variants={itemVariants}>
            <span
              className="
                inline-flex
                items-center
                gap-2
                px-3.5
                py-1.5
                mb-6
                rounded-full
                bg-white/10
                border border-white/20
                backdrop-blur-md
                text-sm
                font-semibold
                text-white
              "
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Welcome to FashionHub
            </span>
          </motion.div>

          {/* Heading */}

          <motion.h1
            variants={itemVariants}
            className="
              text-5xl
              sm:text-6xl
              md:text-7xl
              lg:text-8xl
              font-black
              tracking-tight
              leading-[0.95]
              text-white
              mb-6
            "
          >
            {title}
            <br />

            <span className="text-primary">
              Limitless Style.
            </span>
          </motion.h1>

          {/* Description */}

          <motion.p
            variants={itemVariants}
            className="
              max-w-xl
              text-base
              sm:text-lg
              leading-7
              text-white/75
              mb-9
            "
          >
            {subtitle}
          </motion.p>

          {/* Buttons */}

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-start gap-3"
          >
            <Link
              href={ctaLink}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                h-12
                px-7
                rounded-lg
                bg-primary
                text-white
                text-sm
                font-bold
                shadow-lg
                shadow-black/20
                hover:bg-orange-600
                transition-all
                group
              "
            >
              {ctaText}

              <FiArrowRight
                className="
                  w-4 h-4
                  transition-transform
                  group-hover:translate-x-1
                "
              />
            </Link>

            {/* Secondary CTA */}

            <Link
              href="/categories"
              className="
                inline-flex
                items-center
                justify-center
                h-12
                px-7
                rounded-lg
                border
                border-white/30
                bg-white/5
                backdrop-blur-sm
                text-white
                text-sm
                font-semibold
                hover:bg-white
                hover:text-black
                transition-all
              "
            >
              Explore Categories
            </Link>
          </motion.div>

        </div>
      </motion.div>

      {/* ==========================================
          Scroll Indicator (Now Functional!)
          ========================================== */}

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        onClick={scrollToNextSection}
        className="
          absolute
          bottom-10
          left-1/2
          -translate-x-1/2
          z-10
          hidden sm:flex
          flex-col
          items-center
          gap-2
          text-white/70
          hover:text-primary
          cursor-pointer
          transition-colors
        "
      >
        <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">
          Scroll
        </span>
        <FiChevronDown className="w-6 h-6" />
      </motion.div>

    </section>
  );
}