'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight, FiCheck, FiUsers, FiGlobe, FiAward } from 'react-icons/fi';

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

export default function AboutPage() {
  const values = [
    { icon: FiUsers, title: 'Community First', description: 'Building a thriving community of fashion enthusiasts and sellers' },
    { icon: FiGlobe, title: 'Global Reach', description: 'Connecting fashion lovers worldwide with premium collections' },
    { icon: FiAward, title: 'Quality Assured', description: 'Every product vetted for authenticity and excellence' },
  ];

  const team = [
    { name: 'Emma Wilson', role: 'Founder & CEO', image: 'https://i.pravatar.cc/150?img=5' },
    { name: 'James Chen', role: 'CTO', image: 'https://i.pravatar.cc/150?img=6' },
    { name: 'Sofia Rodriguez', role: 'Head of Design', image: 'https://i.pravatar.cc/150?img=7' },
    { name: 'Marcus Johnson', role: 'Head of Partnerships', image: 'https://i.pravatar.cc/150?img=8' },
  ];

  const timeline = [
    { year: '2020', title: 'Founded FashionHub', description: 'Started with a vision to democratize fashion e-commerce' },
    { year: '2021', title: 'Reached 100K Users', description: 'Rapid growth in customer base and supplier network' },
    { year: '2022', title: 'Global Expansion', description: 'Expanded to 45 countries across four continents' },
    { year: '2024', title: 'Premium Marketplace Launch', description: 'Launched advanced features for suppliers and customers' },
  ];

  return (
    <main className="bg-background">
      {/* Hero Section */}
      <section className="py-20 md:py-32 px-4 bg-gradient-to-b from-primary/5 to-transparent">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center space-y-6"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-balance">
            Fashion Reimagined for Everyone
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            FashionHub is on a mission to make premium fashion accessible, authentic, and inspiring for everyone around the world.
          </p>
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Guiding principles that shape everything we do
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="bg-card p-8 rounded-lg border border-border hover:shadow-lg transition"
                >
                  <Icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 md:py-24 px-4 bg-secondary">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl font-bold mb-4">Meet the Team</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Passionate individuals dedicated to transforming fashion commerce
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {team.map((member, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-background rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 md:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-muted-foreground text-lg">
              Milestones in our growth and expansion
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="flex gap-6 items-start"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                    {item.year}
                  </div>
                  {i < timeline.length - 1 && (
                    <div className="w-1 h-24 bg-border mt-4" />
                  )}
                </div>
                <div className="pt-2">
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-24 px-4 bg-foreground text-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { number: '500K+', label: 'Happy Customers' },
              { number: '5K+', label: 'Fashion Suppliers' },
              { number: '50K+', label: 'Premium Products' },
              { number: '45', label: 'Countries' },
            ].map((stat, i) => (
              <motion.div key={i} variants={itemVariants}>
                <div className="text-4xl md:text-5xl font-bold mb-2 text-primary">
                  {stat.number}
                </div>
                <p className="text-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-24 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold">Ready to Join Our Community?</h2>
          <p className="text-muted-foreground text-lg">
            Whether you&apos;re a fashion enthusiast or a seller, FashionHub has something for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-lg hover:opacity-90 transition font-semibold"
            >
              Get Started <FiArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 border border-border rounded-lg hover:bg-secondary transition font-semibold"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
