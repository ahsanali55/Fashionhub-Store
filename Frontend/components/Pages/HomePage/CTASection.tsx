import React from 'react'
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export default function CTASection() {
  return (
    <section className="py-20 md:py-24 px-4 sm:px-6 bg-background border-b border-border">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center"
      >
        <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
          Ready to Elevate Your Style?
        </motion.h2>
        <motion.p variants={itemVariants} className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover your next favorite piece from trusted fashion suppliers today.
        </motion.p>
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors duration-300"
          >
            Start Shopping
          </Link>
          <Link
            href="/about"
            className="group flex items-center justify-center gap-2 px-8 py-4 text-foreground font-bold rounded-lg hover:bg-muted/60 transition-colors duration-300"
          >
            Learn More
            <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}