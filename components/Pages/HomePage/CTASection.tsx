import React from 'react'
import Link from 'next/link';
import { motion } from 'framer-motion';

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
    <>
       {/* CTA Section */}
      <section className="py-20 md:py-32 px-4 sm:px-6 bg-primary text-primary-foreground">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Elevate Your Style?
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join millions of fashion lovers and discover your next favorite piece today.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="px-8 py-4 bg-accent text-black font-bold rounded-lg hover:opacity-90 transition">
              Start Shopping
            </Link>
            <Link href="/about" className="px-8 py-4 border-2 border-current font-bold rounded-lg hover:bg-white/10 transition">
              Learn More
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  )
}
