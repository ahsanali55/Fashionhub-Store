'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight, FiTruck, FiShield, FiHeadphones, FiCheck, FiStar } from 'react-icons/fi';
import { ProductCard } from '@/components/ProductCard';
import { Marquee } from '@/components/Marquee';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';

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

export default function Home() {
  const products = useSelector((state: RootState) => state.products);
  const featuredProducts = products.items.slice(0, 8);

  const categories = [
    { name: 'Jackets', count: '234 items', image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&h=500&fit=crop' },
    { name: 'Dresses', count: '456 items', image: 'https://images.unsplash.com/photo-1595777707802-51b6b8e01633?w=500&h=500&fit=crop' },
    { name: 'Shoes', count: '567 items', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop' },
    { name: 'Sweaters', count: '189 items', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop' },
    { name: 'Accessories', count: '345 items', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop' },
    { name: 'Shirts', count: '123 items', image: 'https://images.unsplash.com/photo-1517836357463-d25ddfcb53ef?w=500&h=500&fit=crop' },
  ];

  const testimonials = [
    { name: 'Sarah Johnson', rating: 5, text: 'Amazing quality and fast shipping!', role: 'Fashion Enthusiast', avatar: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Michael Chen', rating: 5, text: 'Best online shopping experience!', role: 'Regular Customer', avatar: 'https://i.pravatar.cc/150?img=2' },
    { name: 'Emma Davis', rating: 5, text: 'Love the variety and competitive prices!', role: 'Style Blogger', avatar: 'https://i.pravatar.cc/150?img=3' },
    { name: 'James Wilson', rating: 5, text: 'Premium quality at reasonable prices!', role: 'Fashion Designer', avatar: 'https://i.pravatar.cc/150?img=4' },
    { name: 'Lisa Anderson', rating: 5, text: 'Excellent customer service and support!', role: 'Business Owner', avatar: 'https://i.pravatar.cc/150?img=5' },
    { name: 'David Brown', rating: 5, text: 'Highly recommend to everyone!', role: 'Professional', avatar: 'https://i.pravatar.cc/150?img=6' },
  ];

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

  return (
    <main className="bg-background">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/hero-fashion.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-black/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6"
        >
          <motion.div
            variants={itemVariants}
            className="inline-block px-4 py-2 bg-accent/20 border border-accent rounded-full mb-6 backdrop-blur-sm"
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
      </section>

      {/* Why Choose FashionHub */}
      <section className="py-20 md:py-32 px-4 sm:px-6 bg-card">
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

      {/* Categories Section */}
      <section className="py-20 md:py-32 px-4 sm:px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-4">
              Shop by Category
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-muted-foreground">
              Browse our curated collections across all categories.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {categories.map((category, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative h-64 rounded-xl overflow-hidden cursor-pointer"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-center text-white opacity-100 group-hover:opacity-100 transition">
                  <h3 className="text-2xl font-bold">{category.name}</h3>
                  <p className="text-sm text-gray-300 mt-2">{category.count}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 md:py-32 px-4 sm:px-6 bg-card">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-4">
              Featured Collection
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-muted-foreground">
              Handpicked items for this season.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featuredProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials with Marquee */}
      <section className="py-20 md:py-32 px-4 sm:px-6 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto mb-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-4">
              What Our Customers Say
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied customers worldwide.
            </motion.p>
          </motion.div>
        </div>

        {/* Marquee Testimonials - Top Row */}
        <Marquee className="mb-8" pauseOnHover>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex-shrink-0 w-96 mx-4">
              <motion.div
                whileHover={{ y: -5 }}
                className="p-8 bg-card rounded-xl border border-border hover:shadow-xl transition"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <FiStar key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{testimonial.text}</p>
              </motion.div>
            </div>
          ))}
        </Marquee>

        {/* Marquee Testimonials - Bottom Row (Reverse) */}
        <Marquee reverse className="mb-8" pauseOnHover>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex-shrink-0 w-96 mx-4">
              <motion.div
                whileHover={{ y: -5 }}
                className="p-8 bg-card rounded-xl border border-border hover:shadow-xl transition"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <FiStar key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{testimonial.text}</p>
              </motion.div>
            </div>
          ))}
        </Marquee>
      </section>

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
    </main>
  );
}
