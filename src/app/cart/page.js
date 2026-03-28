"use client";
import React, { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/utils/ScrollToTop';
import Toast from '@/components/Toast';
import { ShoppingCart, Plus, Minus, Trash2, Heart, ChevronRight, Package, Leaf, Wrench, ShieldCheck, CreditCard } from 'lucide-react';
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
  
  const { isAuthenticated } = useAuth();
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

  const EmptyCartView = () => (
    <div className="flex flex-col items-center justify-center py-40 px-6 text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8">
            <ShoppingCart className="h-10 w-10 text-gray-300" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty!</h1>
        <p className="text-gray-500 mb-10 max-w-sm">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/plants" className="px-10 py-3.5 bg-black text-white rounded-full font-semibold transition-all hover:bg-gray-800 shadow-lg active:scale-95 text-sm">
            Explore Plants
        </Link>
    </div>
  );

  const CartItem = ({ item }) => (
    <div key={`${item.itemId}-${item.type}`} className="py-8 first:pt-0 last:pb-0 border-b border-gray-100 last:border-0 group">
      <div className="flex gap-6 md:gap-10">
        {/* Item Image */}
        <div className="w-32 h-32 md:w-44 md:h-44 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 relative">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <span className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold uppercase tracking-wider text-gray-500 border border-gray-100">
             {item.type}
          </span>
        </div>

        {/* Item Details */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 leading-tight mb-3">{item.name}</h3>
                <div className="flex flex-col gap-2">
                    {item.type === 'plant' ? (
                        <>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="text-gray-400 w-20">Category:</span>
                                <span className="text-gray-700 font-medium">{item.category || 'Plants'}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="text-gray-400 w-20">Size:</span>
                                <span className="text-gray-700 font-medium">{item.size || 'Standard'}</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="text-gray-400 w-20">Service:</span>
                                <span className="text-gray-700 font-medium">{item.category || 'Expert Service'}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="text-gray-400 w-20">Duration:</span>
                                <span className="text-gray-700 font-medium">{item.duration || 'Flexible'}</span>
                            </div>
                        </>
                    )}
                </div>
              </div>
            </div>
            
            <div className="text-left md:text-right flex flex-col md:items-end gap-6">
               <p className="text-2xl font-bold text-gray-900">₹{item.price * item.quantity}.00</p>
               <div className="flex items-center gap-4 bg-white border border-gray-200 p-1.5 px-4 rounded-xl shadow-sm">
                  <button onClick={() => decrementQuantity(item.itemId, item.type)} className="text-gray-400 hover:text-black transition-colors">
                    <Minus size={16} />
                  </button>
                  <span className="font-semibold text-sm w-6 text-center">{item.quantity}</span>
                  <button onClick={() => incrementQuantity(item.itemId, item.type)} className="text-black transition-colors">
                    <Plus size={16} />
                  </button>
               </div>
            </div>
          </div>

          {/* Item Actions */}
          <div className="flex gap-6 items-center mt-6">
              <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-black transition-colors">
                 <Heart size={16} /> Save
              </button>
              <button onClick={() => removeFromCart(item.itemId, item.type)} className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors">
                 <Trash2 size={16} /> Remove
              </button>
          </div>
        </div>
      </div>
    </div>
  );

  const plants = cartItems.filter(item => item.type === 'plant');
  const services = cartItems.filter(item => item.type === 'service');

  return (
    <div className="min-h-screen bg-white flex flex-col font-inter">
      <ScrollToTop />
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-10 py-20 pb-40">
        {!isInitialized || cartLoading ? (
            <div className="flex items-center justify-center py-40">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black" />
            </div>
        ) : cartItems.length === 0 ? (
            <EmptyCartView />
        ) : (
            <div className="grid lg:grid-cols-12 gap-16 md:gap-20">
              
              {/* Cart Items List */}
              <div className="lg:col-span-8">
                <div className="flex items-center justify-between mb-12 pb-6 border-b border-gray-100">
                    <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                    <button onClick={clearCart} className="text-xs font-medium text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors">
                        Clear all
                    </button>
                </div>

                <div className="space-y-16">
                  {plants.length > 0 && (
                      <div>
                          <div className="flex items-center gap-3 mb-8 text-green-700">
                               <Leaf size={20} />
                               <h2 className="text-sm font-bold uppercase tracking-wider">Plants</h2>
                          </div>
                          <div>
                            {plants.map(item => <CartItem key={`${item.itemId}-${item.type}`} item={item} />)}
                          </div>
                      </div>
                  )}

                  {services.length > 0 && (
                      <div className={plants.length > 0 ? 'pt-8' : ''}>
                          <div className="flex items-center gap-3 mb-8 text-blue-700">
                               <Wrench size={20} />
                               <h2 className="text-sm font-bold uppercase tracking-wider">Services</h2>
                          </div>
                          <div>
                            {services.map(item => <CartItem key={`${item.itemId}-${item.type}`} item={item} />)}
                          </div>
                      </div>
                  )}
                </div>
              </div>

              {/* Checkout Summary */}
              <div className="lg:col-span-4">
                <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm sticky top-40 mb-20">
                  <h2 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">Order Summary</h2>
                  
                  <div className="space-y-4 text-sm font-medium text-gray-500 mb-10">
                    <div className="flex justify-between items-center text-gray-400">
                      <span>Subtotal</span>
                      <span className="text-gray-900">₹{getTotalPrice()}.00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Delivery</span>
                      <span className="text-green-600 font-bold italic">FREE</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-8 mb-10">
                    <div className="flex justify-between items-baseline">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-3xl font-bold text-gray-900 tracking-tight">₹{getTotalPrice()}.00</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleCheckout} 
                    className="w-full bg-black hover:bg-black/90 text-white py-4.5 rounded-2xl font-bold transition-all shadow-md active:scale-95 shadow-gray-200"
                  >
                    Go to Checkout
                  </button>
                  
                  <div className="mt-8 flex flex-col items-center gap-6">
                      <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl w-full border border-gray-100 group">
                          <div className="flex -space-x-3">
                              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm z-20 group-hover:z-30 transition-all">
                                 <CreditCard size={16} className="text-indigo-400" />
                              </div>
                              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm z-10">
                                 <Package size={16} className="text-amber-400" />
                              </div>
                          </div>
                          <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-900 leading-tight">Payment Methods</p>
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">COD & Online Payments Enabled</p>
                          </div>
                      </div>

                      <button className="text-xs font-bold text-gray-300 hover:text-black transition-colors uppercase tracking-widest">
                          Apply Promo code
                      </button>
                      <div className="flex items-center gap-3 text-gray-300 mt-2">
                         <ShieldCheck size={16} className="text-gray-200" />
                         <p className="text-[10px] uppercase font-bold tracking-widest">30-Day Money Back Guarantee</p>
                      </div>
                  </div>
                </div>
              </div>

            </div>
        )}
      </main>
      <Footer />
      <Toast isVisible={toast.isVisible} message={toast.message} type={toast.type} onClose={() => setToast({ isVisible: false })} />
    </div>
  );
};

export default Cart;
