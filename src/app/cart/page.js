"use client";
import React, { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/utils/ScrollToTop';
import CheckoutModal from '@/components/CheckoutModal';
import Toast from '@/components/Toast';
import { ShoppingCart, Plus, Minus, Trash2, Leaf, Wrench, ArrowLeft } from 'lucide-react';
import api from '@/api/api';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

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
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const handleCheckout = () => {
    if (!isAuthenticated) {
      localStorage.setItem('pendingCheckout', 'true');
      router.push('/auth?mode=login');
      return;
    }
    setShowCheckoutModal(true);
  };

  const handleConfirmOrder = async () => {
    setCheckoutLoading(true);
    try {
      const orderData = {
        deliveryAddress: { street: "N/A", city: "N/A", state: "N/A", pincode: "N/A" },
        contactInfo: { phone: user?.phone || "N/A", email: user?.email || "N/A" }
      };
      const response = await api.post('/api/orders/create', orderData);
      if (response.data.success) {
        setToast({ isVisible: true, message: 'Order confirmed!', type: 'success' });
        await clearCart();
        router.push('/orders');
      }
    } catch (error) {
      setToast({ isVisible: true, message: 'Ordering failed.', type: 'error' });
    } finally {
      setCheckoutLoading(false);
      setShowCheckoutModal(false);
    }
  };

  if (!isInitialized || cartLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-96">Loading...</div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex flex-col items-center justify-center h-96">
          <ShoppingCart className="h-16 w-16 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold">Your Cart is Empty</h1>
          <Link href="/plants" className="mt-4 text-green-600 font-bold">Start Shopping</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollToTop />
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.type}`} className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                  {item.type === 'plant' ? <Leaf className="text-green-600" /> : <Wrench className="text-blue-600" />}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-sm text-gray-500">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => decrementQuantity(item.id, item.type)} className="p-1 bg-gray-100 rounded-full"><Minus className="h-4 w-4" /></button>
                  <span className="font-bold w-4 text-center">{item.quantity}</span>
                  <button onClick={() => incrementQuantity(item.id, item.type)} className="p-1 bg-green-100 rounded-full"><Plus className="h-4 w-4" /></button>
                </div>
                <button onClick={() => removeFromCart(item.id, item.type)} className="text-red-500"><Trash2 className="h-5 w-5" /></button>
              </div>
            ))}
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm h-fit space-y-4">
            <h2 className="text-xl font-bold">Summary</h2>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-green-600">₹{getTotalPrice()}</span>
            </div>
            <button onClick={handleCheckout} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold">Proceed to Checkout</button>
          </div>
        </div>
      </div>
      <CheckoutModal isOpen={showCheckoutModal} onClose={() => setShowCheckoutModal(false)} onConfirm={handleConfirmOrder} cartItems={cartItems} totalAmount={getTotalPrice()} totalItems={getTotalItems()} user={user} loading={checkoutLoading} />
      <Toast isVisible={toast.isVisible} message={toast.message} type={toast.type} onClose={() => setToast({ isVisible: false })} />
      <Footer />
    </div>
  );
};

export default Cart;
