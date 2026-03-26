"use client";
import React from 'react';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Buy Plants', href: '/plants' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <footer className="bg-green-950 text-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-500" />
              <span className="text-2xl font-bold">Nature Lovers</span>
            </div>
            <p className="text-green-100/70 leading-relaxed">
              Transforming spaces into lush, green sanctuaries. Join us in our mission to bring nature closer to every home.
            </p>
            <div className="flex space-x-4">
              <FaFacebook className="h-6 w-6 text-green-400 cursor-pointer hover:text-white transition-colors" />
              <FaInstagram className="h-6 w-6 text-green-400 cursor-pointer hover:text-white transition-colors" />
              <FaTwitter className="h-6 w-6 text-green-400 cursor-pointer hover:text-white transition-colors" />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-green-100/70 hover:text-white transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6">Contact Us</h3>
            <div className="space-y-4 text-green-100/70">
              <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-green-500" /> naturelovers636@gmail.com</div>
              <div className="flex items-center gap-3"><Phone className="h-5 w-5 text-green-500" /> +91 9509899906</div>
              <div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-green-500" /> Hisar, Haryana</div>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-green-900 text-center text-green-100/50">
          <p>© {currentYear} Nature Lovers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
