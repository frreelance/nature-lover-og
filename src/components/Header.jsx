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

  const navItems = isAuthenticated 
    ? [
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/services' },
        { name: 'Buy Plants', href: '/plants' },
        { name: 'Contact', href: '/contact' },
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
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-green-500 p-2 rounded-full">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-green-600">Nature Lovers</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
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

            {/* Single Login/Register Button (unauthenticated only) */}
            {!isAuthenticated && (
              <button
                onClick={() => router.push('/auth?mode=login')}
                className="px-5 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
                type="button"
              >
                Login
              </button>
            )}
            
               {/* Cart Icon (authenticated only) */}
               {isAuthenticated && (
                 <Link
                   href="/cart"
                   className="relative flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
                 >
                   <ShoppingCart className="h-5 w-5" />
                   <span>Cart</span>
                   {getTotalItems() > 0 && (
                     <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                       {getTotalItems()}
                     </span>
                   )}
                 </Link>
               )}

               {/* Logout Button for Authenticated Users */}
               {isAuthenticated && (
                 <button
                   onClick={handleLogout}
                   className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
                 >
                   <LogOut className="h-4 w-4" />
                   <span>Logout</span>
                 </button>
               )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-2 space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block py-2 transition-colors duration-200 ${
                      isActive 
                        ? 'text-green-600 font-semibold border-l-4 border-green-600 pl-2' 
                        : 'text-gray-700 hover:text-green-600'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}

              {/* Mobile Single Login/Register (unauthenticated only) */}
              {!isAuthenticated && (
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push('/auth?mode=login');
                    }}
                    className="w-full px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
                    type="button"
                  >
                    Login
                  </button>
                </div>
              )}
              
                   {/* Mobile Cart Link (authenticated only) */}
                   {isAuthenticated && (
                     <Link
                       href="/cart"
                       className="flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium transition-colors duration-200 py-2"
                       onClick={() => setIsMenuOpen(false)}
                     >
                       <ShoppingCart className="h-4 w-4" />
                       <span>Cart</span>
                       {getTotalItems() > 0 && (
                         <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold ml-2">
                           {getTotalItems()}
                         </span>
                       )}
                     </Link>
                   )}

                   {/* Mobile Logout Button for Authenticated Users */}
                   {isAuthenticated && (
                     <button
                       onClick={handleLogout}
                       className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium transition-colors duration-200 w-full py-2"
                     >
                       <LogOut className="h-4 w-4" />
                       <span>Logout</span>
                     </button>
                   )}
            </div>
          </div>
        )}
      </nav>

    </header>
  );
};

export default Header;
