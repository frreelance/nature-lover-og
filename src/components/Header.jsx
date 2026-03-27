"use client";
import React, { useState, useEffect } from 'react';
import { Menu, X, Leaf, LogOut, ShoppingCart } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
    setIsMenuOpen(false);
  };

  // Logic: Hide Home and Contact for authenticated users
  const navItems = isAuthenticated 
    ? [
        { name: 'Services', href: '/services' },
        { name: 'Buy Plants', href: '/plants' },
        { name: 'Orders', href: '/orders' }
      ]
    : [
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/services' },
        { name: 'Buy Plants', href: '/plants' },
        { name: 'Contact', href: '/contact' }
      ];

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
    }`}>
      {/* Top Bar */}
      <div className="bg-green-900 h-1"></div>
      
      {/* Main Navigation */}
      <nav className="bg-white px-4 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-green-500 p-2 rounded-full group-hover:rotate-12 transition-transform">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-green-600">Nature Lovers</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`transition-colors duration-200 font-medium ${
                      isActive 
                        ? 'text-green-600 border-b-2 border-green-600' 
                        : 'text-gray-700 hover:text-green-600'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div className="h-6 w-[1px] bg-gray-100 hidden lg:block" />

            <div className="flex items-center space-x-6">
                {/* Cart Icon (authenticated only) */}
                {isAuthenticated && (
                  <Link
                    href="/cart"
                    className="relative flex items-center space-x-2 text-green-600 hover:text-green-700 font-bold transition-all duration-200 bg-green-50 px-4 py-2 rounded-xl"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span className="text-sm uppercase tracking-widest pt-0.5">Cart</span>
                    {getTotalItems() > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-black animate-bounce shadow-md">
                        {getTotalItems()}
                      </span>
                    )}
                  </Link>
                )}

                {/* Login Button (unauthenticated only) */}
                {!isAuthenticated && (
                  <button
                    onClick={() => router.push('/auth?mode=login')}
                    className="px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition-all shadow-md active:scale-95 text-sm uppercase tracking-wider"
                    type="button"
                  >
                    Login
                  </button>
                )}

                {/* Logout Button for Authenticated Users */}
                {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-bold transition-all duration-300 shadow-sm hover:shadow-red-200 border border-red-100 group"
                  >
                    <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm uppercase tracking-wider pt-0.5">Logout</span>
                  </button>
                )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-500 hover:text-black"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t mt-4 animate-fade-in">
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block py-3 text-lg transition-colors duration-200 ${
                      isActive 
                        ? 'text-green-600 font-bold' 
                        : 'text-gray-700 font-medium'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}

              <div className="h-[1px] bg-gray-50 w-full" />
              
              <div className="space-y-4 pt-2">
                   {/* Mobile Cart Link (authenticated only) */}
                   {isAuthenticated && (
                     <Link
                       href="/cart"
                       className="flex items-center justify-between bg-green-50 px-5 py-4 rounded-2xl text-green-700 font-bold"
                       onClick={() => setIsMenuOpen(false)}
                     >
                       <div className="flex items-center gap-3">
                           <ShoppingCart className="h-5 w-5" />
                           <span className="uppercase tracking-widest text-sm">Your Cart</span>
                       </div>
                        {getTotalItems() > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                            {getTotalItems()}
                          </span>
                        )}
                     </Link>
                   )}

                   {/* Mobile Logout Button (authenticated only) */}
                   {isAuthenticated && (
                      <button
                        onClick={handleLogout}
                        className="flex items-center justify-center space-x-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white w-full py-4 rounded-2xl font-bold transition-all text-sm uppercase tracking-wider border border-red-100"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                   )}

                   {/* Mobile Login Button (unauthenticated only) */}
                   {!isAuthenticated && (
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          router.push('/auth?mode=login');
                        }}
                        className="w-full px-4 py-4 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold transition-colors uppercase tracking-widest text-sm shadow-lg"
                        type="button"
                      >
                        Login / Sign Up
                      </button>
                   )}
              </div>
            </div>
          </div>
        )}
      </nav>

    </header>
  );
};

export default Header;
