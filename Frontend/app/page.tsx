'use client';

import { TestimonialsSection } from '@/components/Pages/HomePage/TestimonialsSection';
import WhyChooseUs from '@/components/Pages/HomePage/WhyChooseUs';
import Categories from '@/components/Pages/HomePage/Categories';
import { HeroSection } from '@/components/Pages/HomePage/HeroSection';
import CTASection from '@/components/Pages/HomePage/CTASection';

export default function Home() {
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
