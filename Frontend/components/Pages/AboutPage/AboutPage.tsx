'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight, FiUsers, FiShield, FiCode, FiCheck } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
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
  const auth = useSelector((state: RootState) => state.auth);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isLoggedIn = isMounted && auth.isAuthenticated;

  const dashboardHref =
    auth.user?.role === 'admin'
      ? '/admin/dashboard'
      : auth.user?.role === 'supplier'
        ? '/supplier/dashboard'
        : '/customer/dashboard';
  const focus = [
    {
      icon: FiUsers,
      title: 'Multi-Role Marketplace',
      description: 'Customer, Supplier, and Admin roles, each with their own dashboard and permissions.',
    },
    {
      icon: FiShield,
      title: 'Built with Security in Mind',
      description: 'Role-based access control, protected routes, and a proper approval workflow for suppliers.',
    },
    {
      icon: FiCode,
      title: 'MERN Stack',
      description: 'Next.js, Node.js, Express, and MongoDB, from database schema to deployed frontend.',
    },
  ];

  const team = [
    {
      name: 'Awais Tariq',
      role: 'Frontend Development',
      image: '/team/awais.jpeg',
    },
    {
      name: 'Ahsan',
      role: 'Backend & Database',
      image: '/team/ahsan.jpeg',
    },
  ];

  const timeline = [
    { label: 'Proposal', title: 'Project Proposal Chosen', description: 'FashionHub selected and scoped as a multi-role fashion marketplace for CS619.', status: 'done' },
    { label: 'SRS', title: 'SRS Finalized', description: 'Functional and non-functional requirements defined and documented.', status: 'done' },
    { label: 'Design', title: 'Design Document Completed', description: 'ERD, sequence diagrams, architecture, and database schema mapped out.', status: 'done' },
    { label: 'Prototype', title: 'Marketplace Prototype Built', description: 'The core storefront, account flows, navigation, and product search were connected to the application backend.', status: 'done' },
    { label: 'Final', title: 'Final Project Completed', description: 'Completed and verified the marketplace, customer, supplier, and admin experiences, including backend-connected ordering, notifications, and account recovery.', status: 'current' },
  ];

  return (
    <main className="bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-25 md:pt-28 pb-10">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center space-y-6 px-4 relative z-10"
        >
           <span className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 rounded-full bg-primary/10 border border-primary/20 text-sm font-semibold text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Final Year Project · CS619
              </span>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[0.95] text-foreground mb-6">
            About <span className="text-primary">FashionHub</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            A multi-role fashion marketplace connecting suppliers and customers, built by two developers as a
            final year project.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/shop"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-300 font-semibold flex items-center gap-2"
            >
              Explore the Marketplace
            </Link>
            <Link
              href="/contact"
              className="group flex items-center justify-center gap-2 px-8 py-4 text-foreground font-bold rounded-lg hover:bg-muted/60 transition-colors duration-300"
            >
              Get in Touch <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* What We Focused On */}
      <section className="pt-10 md:pt-15 pb-10 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="mb-14 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">What We Focused On</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The core ideas behind how FashionHub was designed and built
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {focus.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="group bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5
                  transition-all duration-300
                  group-hover:bg-primary
                    group-hover:text-primary-foreground
                    group-hover:scale-105
                  ">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-6">{item.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="pt-10 md:pt-15 pb-10 px-4 bg-muted/40">
        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="mb-14 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">The Team</h2>
            <p className="text-muted-foreground text-lg">Two developers, one project</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto"
          >
            {team.map((member, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-bold text-lg text-foreground">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Project Timeline */}
  <section className="pt-10 md:pt-15 pb-10 px-4">
  <div className="max-w-3xl mx-auto">
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="mb-14 text-center"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Project Timeline</h2>
      <p className="text-muted-foreground text-lg">From proposal to a working marketplace</p>
    </motion.div>

    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="space-y-8"
    >
      {timeline.map((item, i) => {
        const isDone = item.status === 'done';
        const isCurrent = item.status === 'current';
        const isUpcoming = item.status === 'upcoming';

        return (
          <motion.div key={i} variants={itemVariants} className="flex gap-6 items-start">
            <div className="flex flex-col items-center shrink-0">
              <div
                className={`size-16 rounded-full flex items-center justify-center font-bold text-xs text-center px-1 transition-colors duration-300 ${
                  isDone
                    ? 'bg-primary text-primary-foreground'
                    : isCurrent
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/25'
                      : 'bg-muted text-muted-foreground border border-border'
                }`}
              >
                {item.label}
              </div>
              {i < timeline.length - 1 && (
                <div className={`w-1 h-20 mt-4 transition-colors duration-300 ${isDone ? 'bg-primary' : 'bg-border'}`} />
              )}
            </div>

            <div className={`pt-2 ${isUpcoming ? 'opacity-60' : ''}`}>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg text-foreground">{item.title}</h3>
                {isDone && (
                  <div className="flex items-center justify-center size-6 rounded-full bg-primary/10 text-primary">
                    <FiCheck className="w-4 h-4 text-primary" />
                  </div>
                )}
                {isCurrent && (
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    Current
                  </span>
                )}
              </div>
              <p className="text-muted-foreground text-sm leading-6">{item.description}</p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  </div>
</section>

      {/* CTA Section */}
      <section className="py-20 px-4 border-t border-border">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Want to See It in Action?</h2>
          <p className="text-muted-foreground text-lg">
            Browse the marketplace or reach out if you have questions about the project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isLoggedIn && (
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-300 font-semibold"
              >
                Create an Account <FiArrowRight className="w-5 h-5" />
              </Link>
            )}
            {isLoggedIn && (
              <Link
                href={dashboardHref}
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-300 font-semibold"
              >
                Go to Your Dashboard
              </Link>
            )}
            <Link
              href="/shop"
              className="group flex items-center justify-center gap-2 px-8 py-4 text-foreground font-bold rounded-lg hover:bg-muted/60 transition-colors duration-300"
            >
              Browse Products    <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}