'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight, FiTruck, FiShield, FiHeadphones, FiCheck, FiStar } from 'react-icons/fi';
import { ProductCard } from '@/components/Reusable_Components/ProductCard';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { TestimonialsSection } from '@/components/Pages/HomePage/TestimonialsSection';
import WhyChooseUs from '@/components/Pages/HomePage/WhyChooseUs';
import Categories from '@/components/Pages/HomePage/Categories';
import { HeroSection } from '@/components/Pages/HomePage/HeroSection';
import CTASection from '@/components/Pages/HomePage/CTASection';

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
  return (
    <main className="bg-background">

      <HeroSection />
      <WhyChooseUs />
      <Categories />
      <TestimonialsSection />
      <CTASection />

    </main>
  );
}
