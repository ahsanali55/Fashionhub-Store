'use client';

import Link from 'next/link';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="bg-foreground text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="font-bold text-lg">FashionHub</span>
            </div>
            <p className="text-sm text-gray-300">Your destination for premium fashion from suppliers worldwide.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/shop" className="hover:text-white transition">Shop</Link></li>
              <li><Link href="/categories" className="hover:text-white transition">Categories</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition">Shipping Info</Link></li>
              <li><Link href="/returns" className="hover:text-white transition">Returns</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <FiPhone className="w-4 h-4" />
                <span>1-800-FASHION</span>
              </li>
              <li className="flex items-center gap-2">
                <FiMail className="w-4 h-4" />
                <span>hello@fashionhub.com</span>
              </li>
              <li className="flex items-start gap-2">
                <FiMapPin className="w-4 h-4 mt-1" />
                <span>123 Fashion St, Style City, SC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-300">&copy; 2024 FashionHub. All rights reserved.</p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-300 hover:text-white transition">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
