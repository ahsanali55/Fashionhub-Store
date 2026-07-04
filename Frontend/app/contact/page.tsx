'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 800);
  };

  const contactInfo = [
    {
      icon: FiPhone,
      title: 'Phone',
      details: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
    },
    {
      icon: FiMail,
      title: 'Email',
      details: 'support@fashionhub.com',
      link: 'mailto:support@fashionhub.com',
    },
    {
      icon: FiMapPin,
      title: 'Address',
      details: '123 Fashion Street, NY 10001',
      link: 'https://maps.google.com',
    },
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
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have a question or feedback? We&apos;d love to hear from you. Our team is here to help.
          </p>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="py-20 md:py-24 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl font-bold mb-8">Contact Information</h2>
              <p className="text-muted-foreground mb-12">
                Reach out to us through any of these channels and we&apos;ll respond as soon as possible.
              </p>
            </div>

            {contactInfo.map((info, i) => {
              const Icon = info.icon;
              return (
                <motion.a
                  key={i}
                  href={info.link}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 p-4 rounded-lg hover:bg-secondary transition group cursor-pointer"
                >
                  <Icon className="w-6 h-6 text-primary flex-shrink-0 group-hover:scale-110 transition" />
                  <div>
                    <h3 className="font-semibold mb-1">{info.title}</h3>
                    <p className="text-muted-foreground group-hover:text-foreground transition">
                      {info.details}
                    </p>
                  </div>
                </motion.a>
              );
            })}

            {/* Social Links */}
            <div className="pt-8 space-y-4">
              <h3 className="font-semibold">Follow Us</h3>
              <div className="flex gap-4">
                {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                  <button
                    key={social}
                    className="w-10 h-10 rounded-lg bg-secondary hover:bg-primary hover:text-white transition flex items-center justify-center font-semibold text-sm"
                  >
                    {social.charAt(0)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="bg-card rounded-lg shadow-lg p-8">
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 bg-green-500/10 border border-green-500 text-green-700 rounded-lg"
                >
                  Thank you! We&apos;ve received your message and will get back to you soon.
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:ring-2 focus:ring-primary focus:outline-none"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:ring-2 focus:ring-primary focus:outline-none"
                    required
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:ring-2 focus:ring-primary focus:outline-none"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                    required
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 rounded-lg hover:opacity-90 transition font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <FiSend className="w-5 h-5" />
                  {loading ? 'Sending...' : 'Send Message'}
                </motion.button>
              </form>

              <p className="text-xs text-muted-foreground text-center mt-6">
                We typically respond within 24 hours during business days.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-24 px-4 bg-secondary">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Find answers to common questions
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {[
              {
                q: 'What is FashionHub?',
                a: 'FashionHub is a premium online marketplace connecting fashion enthusiasts with quality suppliers worldwide.',
              },
              {
                q: 'How do I become a supplier?',
                a: 'Visit our Supplier Program page and fill out the application. Our team will review and contact you within 5 business days.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, PayPal, Apple Pay, Google Pay, and bank transfers for wholesale orders.',
              },
              {
                q: 'How long does shipping take?',
                a: 'Standard shipping takes 5-7 business days. Express options available for an additional fee.',
              },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-background rounded-lg p-6 hover:shadow-md transition"
              >
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-muted-foreground text-sm">{faq.a}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
