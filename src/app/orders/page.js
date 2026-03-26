"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/utils/ScrollToTop';
import { useRouter } from 'next/navigation';
import { Package, ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, ShoppingBag, Leaf, Eye, Calendar, User, X } from 'lucide-react';
import api from '@/api/api';

const Orders = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth?mode=login');
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) loadOrders();
  }, [isAuthenticated]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/orders');
      if (response.data.success) setOrders(response.data.data.orders || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-orange-100 text-orange-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (!isAuthenticated) return null;
  if (loading) return <div className="min-h-screen"><Header /><div className="flex items-center justify-center pt-32">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollToTop />
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold">No orders found</h2>
            <button onClick={() => router.push('/plants')} className="mt-4 text-green-600 font-bold">Start Shopping</button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold">Order #{order._id.slice(-6)}</h3>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">₹{order.totalAmount}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>{order.status}</span>
                </div>
                <button onClick={() => { setSelectedOrder(order); setShowOrderModal(true); }} className="p-2 bg-gray-50 rounded-lg"><Eye className="h-5 w-5 text-gray-600" /></button>
              </div>
            ))}
          </div>
        )}
      </div>
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Order Details</h2>
              <button onClick={() => setShowOrderModal(false)}><X /></button>
            </div>
            <div className="space-y-4">
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between border-b pb-2">
                  <span>{item.name} x {item.quantity}</span>
                  <span className="font-bold">₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-lg pt-4">
                <span>Total</span>
                <span className="text-green-600">₹{selectedOrder.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Orders;
