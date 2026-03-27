"use client";
import React, { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/utils/ScrollToTop';
import Toast from '@/components/Toast';
import { ShoppingCart, Plus, Minus, Trash2, Leaf, Wrench, ArrowLeft, Package, ChevronRight } from 'lucide-react';
import api from '@/api/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    incrementQuantity, 
    decrementQuantity, 
    getTotalItems, 
    getTotalPrice,
    clearCart,
    isInitialized,
    loading: cartLoading
  } = useCart();
  
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const handleCheckout = () => {
    if (!isAuthenticated) {
      localStorage.setItem('pendingCheckout', 'true');
      router.push('/auth?mode=login');
      return;
    }
    router.push('/checkout');
  };

  if (!isInitialized || cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      </div>
    );
  }

  const plants = cartItems.filter(item => item.type === 'plant');
  const services = cartItems.filter(item => item.type === 'service');

  const getSectionTotal = (items) => items.reduce((total, item) => total + (item.price * item.quantity), 0);

  const plantTotalSource = getSectionTotal(plants);
  const serviceTotalSource = getSectionTotal(services);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Header />
        <div className="bg-white p-12 rounded-[3rem] shadow-sm flex flex-col items-center border border-gray-100">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <ShoppingCart className="h-10 w-10 text-gray-300" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h1>
            <p className="text-gray-400 mb-8 max-w-xs text-center text-sm">Looks like you haven't added anything to your cart yet.</p>
            <Link href="/plants" className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold transition-all shadow-lg active:scale-95">
                Start Shopping
            </Link>
        </div>
      </div>
    );
  }

  const CartSection = ({ title, items, total, icon: Icon, colorClass }) => {
    if (items.length === 0) return null;
    return (
      <div className="space-y-4 mb-10">
        <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10 text-opacity-100`}>
                    <Icon size={18} className={colorClass.replace('bg-', 'text-')} />
                </div>
                <h2 className="text-lg font-black text-gray-800 uppercase tracking-widest">{title}</h2>
            </div>
            <span className="text-sm font-bold text-gray-400">{items.length} {items.length === 1 ? 'Item' : 'Items'}</span>
        </div>
        
        <div className="space-y-3">
          {items.map((item) => (
            <div key={`${item.itemId}-${item.type}`} className="bg-white p-3 md:p-4 rounded-[1.5rem] shadow-sm hover:shadow-md transition-all flex items-center gap-4 border border-gray-100 group">
              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-sm md:text-base line-clamp-1">{item.name}</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                     {item.size && <p className="text-[10px] font-bold text-gray-400"><span className="text-gray-300">Size:</span> {item.size}</p>}
                     {item.duration && <p className="text-[10px] font-bold text-gray-400"><span className="text-gray-300">Plan:</span> {item.duration}</p>}
                     {item.category && <p className="text-[10px] font-bold text-gray-400"><span className="text-gray-300">Type:</span> {item.category}</p>}
                </div>
                <p className="text-green-600 font-black text-sm mt-1">₹{item.price}</p>
              </div>

              <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl">
                  <button 
                      onClick={() => decrementQuantity(item.itemId, item.type)} 
                      className="p-1 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                  >
                      <Minus className="h-4 w-4 text-gray-400" />
                  </button>
                  <span className="font-bold w-6 text-center text-xs">{item.quantity}</span>
                  <button 
                      onClick={() => incrementQuantity(item.itemId, item.type)} 
                      className="p-1 hover:bg-white hover:shadow-sm rounded-lg transition-all text-green-600"
                  >
                      <Plus className="h-4 w-4" />
                  </button>
              </div>
              
              <button 
                  onClick={() => removeFromCart(item.itemId, item.type)} 
                  className="p-2 text-gray-200 hover:text-red-500 transition-colors"
              >
                  <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end px-4 py-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {title} Subtotal: <span className="text-gray-900 ml-2 text-sm italic">₹{total}</span>
            </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <ScrollToTop />
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter">My Cart</h1>
                <p className="text-gray-500 font-medium text-sm">Review your selected plants and services before checkout.</p>
            </div>
            <button onClick={clearCart} className="flex items-center gap-2 text-red-400 hover:text-red-500 font-bold transition-all text-xs uppercase tracking-widest">
                <Trash2 size={14} /> Clear All
            </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
             <CartSection title="Green Plants" items={plants} total={plantTotalSource} icon={Leaf} colorClass="text-green-600" />
             <CartSection title="Expert Services" items={services} total={serviceTotalSource} icon={Wrench} colorClass="text-blue-600" />
          </div>

          <div className="lg:col-span-4">
              <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-8">
                    {plants.length > 0 && (
                        <div className="flex justify-between text-gray-400 font-bold text-xs">
                            <span className="uppercase tracking-widest">Plants Total</span>
                            <span className="text-gray-800 italic">₹{plantTotalSource}</span>
                        </div>
                    )}
                    {services.length > 0 && (
                        <div className="flex justify-between text-gray-400 font-bold text-xs">
                            <span className="uppercase tracking-widest">Services Total</span>
                            <span className="text-gray-800 italic">₹{serviceTotalSource}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-gray-400 font-bold text-xs border-t border-gray-50 pt-4">
                        <span className="uppercase tracking-widest">Delivery</span>
                        <span className="text-green-600">FREE</span>
                    </div>
                </div>

                <div className="border-t-2 border-dashed border-gray-50 pt-6 mb-8 flex flex-col gap-1 items-end">
                    <span className="font-extrabold text-gray-300 uppercase tracking-[0.2em] text-[10px]">Total Amount</span>
                    <span className="text-3xl font-black text-green-600 tracking-tighter">₹{getTotalPrice()}</span>
                </div>

                <button 
                    onClick={handleCheckout} 
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-3xl font-black text-base shadow-xl shadow-green-100 transition-all flex items-center justify-center gap-2 group active:scale-95"
                >
                    Checkout Now <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                
                <div className="mt-6 flex items-center justify-center gap-4 text-gray-300">
                     <Package size={16} />
                     <p className="text-[10px] font-bold uppercase tracking-widest">Safe & Secure Payment</p>
                </div>
              </div>
          </div>
        </div>
      </div>
      <Toast isVisible={toast.isVisible} message={toast.message} type={toast.type} onClose={() => setToast({ isVisible: false })} />
      <Footer />
    </div>
  );
};

export default Cart;
