'use client';

import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import { FiMail, FiGithub, FiLinkedin, FiArrowUpRight, FiArrowRight } from 'react-icons/fi';

const heroContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' },
  },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface Developer {
  name: string;
  role: string;
  image: string;
  bio: string;
  email: string;
  github: string;
  linkedin: string;
}

const developers: Developer[] = [
  {
    name: 'Awais Tariq',
    role: 'Frontend Development',
    image: '/team/awais.jpeg',
    bio: 'Built the customer, supplier, and admin interfaces, along with the overall design system for FashionHub.',
    email: 'your-email@example.com',
    github: 'https://github.com/awazii',
    linkedin: 'https://linkedin.com/in/awaistariq-frontend',
  },
  {
    name: 'Ahsan',
    role: 'Backend & Database',
    image: '/team/ahsan.jpeg',
    bio: 'Built the API, authentication, and database layer powering the marketplace.',
    email: 'ahsanalijawad599@gmail.com',
    github: 'https://github.com/ahsanali55',
    linkedin: 'https://www.linkedin.com/in/ahsan-ali-11a556317/',
  },
];

export default function ContactPage() {
  return (
    <main className="bg-background">
      {/* Hero - same layout as homepage HeroSection, no background image */}
      <section className="relative overflow-hidden">
        <motion.div
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center"
        >
          <div className="max-w-3xl flex flex-col items-center">
            {/* Small Brand Label */}
            <motion.div variants={heroItemVariants}>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 rounded-full bg-primary/10 border border-primary/20 text-sm font-semibold text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Get in Touch
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={heroItemVariants}
              className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[0.95] text-foreground mb-6"
            >
              Talk to the
              <br />
              <span className="text-primary">Developers.</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={heroItemVariants}
              className="max-w-xl text-base sm:text-lg leading-7 text-muted-foreground mb-9"
            >
              FashionHub is built and maintained by two people, not a support team. Reach out directly.
            </motion.p>

            {/* Buttons */}
            <motion.div variants={heroItemVariants} className="flex flex-col sm:flex-row items-start gap-3">
              <a
                href={`mailto:${developers[0].email}`}
                className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-lg bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-black/5 hover:bg-primary/90 transition-all group"
              >
                Send a Message
              </a>

              <Link
                href="/shop"
                className="group flex items-center justify-center gap-2 px-8 py-4 text-foreground font-bold rounded-lg hover:bg-muted/60 transition-colors duration-300"
              >
                Explore FashionHub <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Developer Cards */}
      <section className="pb-10 px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {developers.map((dev) => (
            <motion.div
              key={dev.name}
              variants={itemVariants}
              className="group bg-card border border-border rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={dev.image}
                  alt={dev.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent " />
                <div className="absolute bottom-4 left-5">
                  <h2 className="text-xl font-bold text-white">{dev.name}</h2>
                  <p className="text-sm text-white/80">{dev.role}</p>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <p className="text-sm text-muted-foreground leading-6 h-17">{dev.bio}</p>

                <div className="flex items-center gap-3">
                  <a
                    href={`mailto:${dev.email}`}
                    title="Email"
                    className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                  >
                    <FiMail className="w-4 h-4" />
                  </a>
                  <a
                    href={dev.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="GitHub"
                    className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                  >
                    <FiGithub className="w-4 h-4" />
                  </a>
                  <a
                    href={dev.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="LinkedIn"
                    className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                  >
                    <FiLinkedin className="w-4 h-4" />
                  </a>

                  <a
                    href={`mailto:${dev.email}`}
                    className="ml-auto flex items-center gap-1 text-sm font-semibold text-primary  group"
                  >
                    Message
                    <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Small honest footnote instead of a fake FAQ */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mt-10 max-w-md mx-auto"
        >
          FashionHub is a final year project built for CS619, not a live commercial platform.
        </motion.p>
      </section>
    </main>
  );
}