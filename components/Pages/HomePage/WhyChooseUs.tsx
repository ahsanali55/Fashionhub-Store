import React from 'react'
import { FiCheck, FiHeadphones, FiShield, FiTruck } from 'react-icons/fi';
import { motion } from 'framer-motion';

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
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};
const whyChoose = [
    {
      icon: FiTruck,
      title: 'Free Shipping',
      description: 'On all orders over $100. Fast and reliable delivery worldwide.',
    },
    {
      icon: FiShield,
      title: 'Secure Payment',
      description: 'Multiple payment options with 100% secure transactions.',
    },
    {
      icon: FiHeadphones,
      title: '24/7 Support',
      description: 'Dedicated customer service team ready to help anytime.',
    },
    {
      icon: FiCheck,
      title: 'Quality Assured',
      description: 'Premium products verified for quality and authenticity.',
    },
  ];
export default function WhyChooseUs() {
  return (
    <>
    {/* Why Choose FashionHub */}
      <section className="py-10 md:py-22 px-4 sm:px-6 bg-card">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose FashionHub?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We deliver exceptional value and unmatched customer experience.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {whyChoose.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="p-8 bg-background rounded-xl border border-border hover:shadow-lg hover:border-accent transition group"
                >
                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-white transition">
                    <Icon className="w-6 h-6 text-accent group-hover:text-white transition" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
      </>
  )
}
