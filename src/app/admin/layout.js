"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  LogOut,
  Menu,
  X,
  ArrowLeft,
  Bell,
  Search,
  ChevronRight
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const { logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/users', icon: Users, label: 'User' },
    { path: '/admin/products', icon: ShoppingCart, label: 'Product' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Order' },
    { path: '/admin/payments', icon: ShoppingCart, label: 'Payment' },
    { path: '/admin/offers', icon: ShoppingCart, label: 'Offers' }
  ];

  // Don't show sidebar on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen bg-gray-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white text-gray-800 rounded-lg shadow-lg border border-gray-100"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <aside
          className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 text-gray-800 transform transition-transform duration-300 ease-in-out z-40 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 overflow-y-auto`}
        >
          <div className="p-6 h-full flex flex-col">
            <h1 className="text-xl font-bold text-gray-900 mb-10 px-4">Admin Panel</h1>
            <nav className="space-y-1 flex-1">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 border-l-4 transition-all duration-200 ${
                      isActive
                        ? 'bg-purple-50/50 text-purple-600 border-purple-600 font-bold'
                        : 'text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-3 border-l-4 border-transparent text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 w-full mt-4"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </nav>
            <div className="mt-8 pt-6 border-t border-gray-50">
              <p className="text-xs text-gray-400 text-center">
                Nature Lovers Admin<br/>© 2026
              </p>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)} className="lg:hidden fixed inset-0 bg-black/50 z-30 transition-opacity" />
        )}

        <main className="lg:ml-64 min-h-screen">
          {/* Top Header */}
          <header className="sticky top-0 z-30 bg-white border-b border-gray-100 flex items-center justify-between px-6 py-4">
             <div className="flex items-center gap-4">
               <button 
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-50 rounded-full transition-colors group"
               >
                 <ArrowLeft size={18} className="text-gray-400 group-hover:text-gray-900 group-hover:-translate-x-0.5 transition-all" />
               </button>
               <div className="h-4 w-px bg-gray-100 mx-1"></div>
               <nav className="flex items-center gap-2 text-xs font-medium text-gray-400">
                  <span className="hover:text-gray-600 transition-colors uppercase tracking-widest">ADMIN</span>
                  <ChevronRight size={10} />
                  <span className="text-gray-900 font-bold capitalize">{pathname.split('/').pop().replace('-', ' ')}</span>
               </nav>
             </div>
             
             <div className="flex items-center gap-3">
               <button className="p-2.5 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-gray-900 transition-all border border-transparent hover:border-gray-100">
                 <Search size={18} />
               </button>
               <button className="p-2.5 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-gray-900 transition-all border border-transparent hover:border-gray-100 relative">
                 <Bell size={18} />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full border-2 border-white"></span>
               </button>
               <div className="h-8 w-px bg-gray-100 mx-2"></div>
               <div className="flex items-center gap-3 pl-2">
                  <div className="text-right hidden sm:block">
                     <p className="text-xs font-bold text-gray-900 leading-none">System Admin</p>
                     <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Superuser</p>
                  </div>
                  <div className="w-9 h-9 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center font-black text-sm shadow-sm border border-purple-200">
                    A
                  </div>
               </div>
             </div>
          </header>

          <div className="p-6 lg:p-10 max-w-[1440px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </ProtectedAdminRoute>
  );
};

export default AdminLayout;
