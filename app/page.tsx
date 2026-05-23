'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight, FiTruck, FiShield, FiHeadphones, FiCheck } from 'react-icons/fi';
import { ProductCard } from '@/components/ProductCard';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import gsap from 'gsap';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
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
  const featuredProducts = products.items.slice(0, 4);
  const heroRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  const categories = [
    { name: 'Jackets', count: '234 items', image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&h=500&fit=crop' },
    { name: 'Dresses', count: '456 items', image: 'https://images.unsplash.com/photo-1595777707802-51b6b8e01633?w=500&h=500&fit=crop' },
    { name: 'Shoes', count: '567 items', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop' },
    { name: 'Sweaters', count: '189 items', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop' },
    { name: 'Accessories', count: '345 items', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop' },
    { name: 'Shirts', count: '123 items', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop' },
  ];

  const testimonials = [
    { name: 'Sarah Johnson', rating: 5, text: 'Amazing quality and fast shipping! Highly recommend.', role: 'Fashion Enthusiast', avatar: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Michael Chen', rating: 5, text: 'Best online shopping experience I\'ve had. Great customer service!', role: 'Regular Customer', avatar: 'https://i.pravatar.cc/150?img=2' },
    { name: 'Emma Davis', rating: 5, text: 'Love the variety and competitive prices. Will definitely shop again!', role: 'Style Blogger', avatar: 'https://i.pravatar.cc/150?img=3' },
    { name: 'James Wilson', rating: 5, text: 'Premium quality items at reasonable prices. Five stars!', role: 'Fashion Designer', avatar: 'https://i.pravatar.cc/150?img=4' },
  ];

  // GSAP Hero Animation
  useEffect(() => {
    if (!heroRef.current) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline();

      timeline
        .from('.hero-title', { y: 100, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0)
        .from('.hero-subtitle', { y: 100, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0.2)
        .from('.hero-buttons', { y: 100, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0.4)
        .from('.hero-bg-element', { scale: 1.2, opacity: 0, duration: 1.2, ease: 'power2.out' }, 0);
    }, heroRef);

    return () => context.revert();
  }, []);

  // Testimonials auto-scroll animation
  useEffect(() => {
    if (!testimonialsRef.current) return;

    const testimonialCards = testimonialsRef.current.querySelectorAll('.testimonial-card');
    
    gsap.to(testimonialCards, {
      y: -20,
      opacity: 0.3,
      duration: 0.6,
      stagger: {
        each: 0.1,
        repeat: -1,
        yoyo: true,
      },
    });
  }, []);

  return (
    <main className="bg-background">
      {/* Hero Section with GSAP */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-accent/8 to-transparent" />
        
        {/* Animated Background Elements */}
        <div className="hero-bg-element absolute top-10 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-accent/15 rounded-full blur-3xl" />

        <motion.div
          className="relative z-10 text-center max-w-3xl mx-auto px-4"
        >
          <motion.h1
            className="hero-title text-5xl md:text-7xl font-bold mb-6 text-balance leading-tight"
          >
            Premium Fashion, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Limitless Style</span>
          </motion.h1>

          <motion.p
            className="hero-subtitle text-lg md:text-xl text-muted-foreground mb-8 text-balance"
          >
            Discover curated collections from world-class suppliers. Elevate your wardrobe with premium quality and exclusive designs.
          </motion.p>

          <motion.div
            className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/shop"
              className="group px-8 py-4 bg-primary text-white rounded-lg hover:opacity-90 transition font-semibold flex items-center gap-2 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Shop Now <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </span>
            </Link>
            <Link
              href="/categories"
              className="px-8 py-4 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition font-semibold"
            >
              Explore Collections
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Categories Section - Enhanced */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Browse through our premium collection of fashion items
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                className="relative h-48 md:h-56 rounded-lg overflow-hidden cursor-pointer group"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-bold text-lg">{cat.name}</h3>
                  <p className="text-white/80 text-sm">{cat.count}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Trending Now</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Bestselling items loved by our community
            </p>
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition font-semibold"
            >
              Explore All Products <FiArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose FashionHub?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The complete destination for fashion-forward shoppers and premium sellers
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {[
              { title: 'Curated Collections', desc: 'Handpicked products from verified suppliers' },
              { title: 'Best Prices', desc: 'Competitive pricing with regular discounts' },
              { title: 'Fast Delivery', desc: '5-7 day shipping to most locations' },
              { title: 'Buyer Protection', desc: '100% money-back guarantee' },
              { title: 'Verified Sellers', desc: 'All sellers are thoroughly vetted' },
              { title: 'Expert Support', desc: '24/7 customer service team ready to help' },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FiCheck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Premium Testimonials Section - Enhanced */}
      <section ref={testimonialsRef} className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Loved by Fashion Lovers</h2>
            <p className="text-muted-foreground text-lg">Real reviews from real customers</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                className="testimonial-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <div className="bg-card p-6 rounded-xl shadow-md hover:shadow-xl transition h-full flex flex-col backdrop-blur-sm border border-border/50">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <span key={j} className="text-accent text-lg">★</span>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-foreground mb-6 flex-grow italic">&quot;{testimonial.text}&quot;</p>

                  {/* Author */}
                  <div className="flex items-center gap-3 border-t border-border pt-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-foreground text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants} className="text-center">
              <FiTruck className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-300">On orders over $100. Fast and reliable delivery.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <FiShield className="w-12 h-12 mx-auto mb-4 text-accent" />
              <h3 className="text-xl font-semibold mb-2">Secure Shopping</h3>
              <p className="text-gray-300">100% secure transactions with buyer protection.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <FiHeadphones className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-300">Dedicated customer service team ready to help.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-8">Get the latest fashion trends and exclusive offers delivered to your inbox.</p>

            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition font-semibold">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
