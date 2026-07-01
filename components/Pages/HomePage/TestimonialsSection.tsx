'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FiStar } from 'react-icons/fi';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  rating: number;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Anderson',
    role: 'Fashion Blogger',
    text: 'FashionHub transformed how I shop. The curated selection is absolutely stunning and the quality is unmatched.',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    role: 'Style Enthusiast',
    text: 'The variety and quality of products here is incredible. I found exactly what I was looking for and more!',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: 3,
    name: 'Emma Davis',
    role: 'Professional Stylist',
    text: 'As a stylist, I recommend FashionHub to all my clients. Premium quality meets affordability perfectly.',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: 4,
    name: 'James Wilson',
    role: 'Fashion Designer',
    text: 'The platform connects me with amazing designers. The experience has been seamless and professional.',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
  {
    id: 5,
    name: 'Olivia Martinez',
    role: 'Customer',
    text: 'Shopping on FashionHub is a breeze. Fast delivery and exceptional customer service throughout.',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: 6,
    name: 'Alex Chen',
    role: 'Entrepreneur',
    text: 'Best marketplace for fashion! The sellers are professional and the quality is consistently excellent.',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=6',
  },
  {
    id: 1,
    name: 'Sarah Anderson',
    role: 'Fashion Blogger',
    text: 'FashionHub transformed how I shop. The curated selection is absolutely stunning and the quality is unmatched.',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    role: 'Style Enthusiast',
    text: 'The variety and quality of products here is incredible. I found exactly what I was looking for and more!',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: 3,
    name: 'Emma Davis',
    role: 'Professional Stylist',
    text: 'As a stylist, I recommend FashionHub to all my clients. Premium quality meets affordability perfectly.',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: 4,
    name: 'James Wilson',
    role: 'Fashion Designer',
    text: 'The platform connects me with amazing designers. The experience has been seamless and professional.',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
  {
    id: 5,
    name: 'Olivia Martinez',
    role: 'Customer',
    text: 'Shopping on FashionHub is a breeze. Fast delivery and exceptional customer service throughout.',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: 6,
    name: 'Alex Chen',
    role: 'Entrepreneur',
    text: 'Best marketplace for fashion! The sellers are professional and the quality is consistently excellent.',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=6',
  },
];

export function TestimonialsSection() {
  const [duplicatedTestimonials, setDuplicatedTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    setDuplicatedTestimonials([...testimonials, ...testimonials, ...testimonials]);
  }, []);
 
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Loved by Fashion Enthusiasts
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Join thousands of satisfied customers who trust FashionHub for premium fashion
          </motion.p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative h-[700px] flex items-center justify-center gap-8 overflow-hidden">
          {/* Gradient masks */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background to-transparent z-10" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent z-10" />

          {/* Scrolling container */}
          <motion.div
            animate={{ y: ['0%', '-50%'] }}
            transition={{
              duration: 150,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'linear',
            }}
            className="space-y-6 py-8"
          >
            {duplicatedTestimonials.map((testimonial, idx) => (
              <motion.div
                key={`${testimonial.id}-${idx}`}
                initial={{ opacity: 0.5 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-card border border-border/50 rounded-xl p-6 w-96 shadow-sm hover:shadow-lg transition-shadow"
              >
                {/* Star Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar
                      key={i}
                      className="w-5 h-5 fill-accent text-accent"
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-foreground mb-6 line-clamp-3">
                  "{testimonial.text}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <motion.img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                    whileHover={{ scale: 1.1 }}
                  />
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Scrolling container */}
          <motion.div
            animate={{ y: ['0%', '50%'] }}
            transition={{
              duration: 150,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'linear',
            }}
            className="space-y-6 py-8"
          >
            {duplicatedTestimonials.map((testimonial, idx) => (
              <motion.div
                key={`${testimonial.id}-${idx}`}
                initial={{ opacity: 0.5 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-card border border-border/50 rounded-xl p-6 w-96 shadow-sm hover:shadow-lg transition-shadow"
              >
                {/* Star Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar
                      key={i}
                      className="w-5 h-5 fill-accent text-accent"
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-foreground mb-6 line-clamp-3">
                  "{testimonial.text}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <motion.img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                    whileHover={{ scale: 1.1 }}
                  />
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Scrolling container */}
          <motion.div
            animate={{ y: ['0%', '-50%'] }}
            transition={{
              duration: 150,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'linear',
            }}
            className="space-y-6 py-8"
          >
            {duplicatedTestimonials.map((testimonial, idx) => (
              <motion.div
                key={`${testimonial.id}-${idx}`}
                initial={{ opacity: 0.5 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-card border border-border/50 rounded-xl p-6 w-96 shadow-sm hover:shadow-lg transition-shadow"
              >
                {/* Star Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar
                      key={i}
                      className="w-5 h-5 fill-accent text-accent"
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-foreground mb-6 line-clamp-3">
                  "{testimonial.text}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <motion.img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                    whileHover={{ scale: 1.1 }}
                  />
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-3 gap-8 mt-20 text-center"
        >
          <div>
            <p className="text-4xl font-bold text-accent">50K+</p>
            <p className="text-muted-foreground mt-2">Happy Customers</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-accent">4.9★</p>
            <p className="text-muted-foreground mt-2">Average Rating</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-accent">1000+</p>
            <p className="text-muted-foreground mt-2">Premium Sellers</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
