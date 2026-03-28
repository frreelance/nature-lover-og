"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { 
  ArrowLeft, 
  Search, 
  Bell, 
  User, 
  Package, 
  Truck, 
  MapPin, 
  CreditCard,
  CheckCircle2,
  Clock,
  MoreVertical,
  Calendar,
  DollarSign,
  Banknote,
  ShieldCheck
} from 'lucide-react';
import api from '@/api/api';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateStatus, setUpdateStatus] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/admin/orders/${id}`);
      setOrder(response.data.data);
      setUpdateStatus(response.data.data.status);
    } catch (error) {
      toast.error('Failed to fetch order details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (statusOverride = null) => {
    const finalStatus = statusOverride || updateStatus;
    try {
      await api.patch(`/api/admin/orders/${id}`, { 
        status: finalStatus,
        note: note 
      });
      toast.success(`Order status updated to ${finalStatus}`);
      fetchOrderDetails();
      setNote('');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const isCancelled = order?.status === 'cancelled';
  const isDelivered = order?.status === 'delivered';
  const isRefunded = order?.status === 'refunded';
  const isFinalized = isDelivered || isRefunded;

  const getAvailableStatuses = () => {
    if (!order) return [];
    const current = order.status;
    const isCOD = order.paymentMethod?.toLowerCase() === 'cod';
    
    if (current === 'pending') return ['processed', 'cancelled'];
    if (current === 'processed') return ['shipped', 'cancelled'];
    if (current === 'shipped') return ['delivered', 'cancelled'];
    if (current === 'cancelled' && !isCOD) return ['refunded'];
    return [];
  };

  const availableOptions = getAvailableStatuses();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Order not found</p>
        <button onClick={() => router.back()} className="mt-4 text-purple-600 font-semibold">Go Back</button>
      </div>
    );
  }

  const statusSteps = [
    { label: 'Order Received', status: 'pending', icon: <CheckCircle2 size={18} /> },
    { label: 'Order Processed', status: 'processed', icon: <CheckCircle2 size={18} /> },
    { label: 'Out for Delivery', status: 'shipped', icon: <Truck size={18} /> },
    { label: 'Delivered', status: 'delivered', icon: <Package size={18} /> },
  ];

  const currentStep = statusSteps.findIndex(s => s.status === order.status);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <Toaster />
      
      {/* Main Order Info Card */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-500">Orders ID:</span>
            <span className="text-sm font-bold text-gray-900">#{order._id.slice(-8).toUpperCase()}</span>
            <span className={`px-4 py-1 rounded-full text-xs font-bold capitalize ${
              order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
              order.status === 'pending' ? 'bg-orange-100 text-orange-700' : 
              order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
              order.status === 'refunded' ? 'bg-gray-100 text-gray-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {order.status}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Calendar size={16} />
            <span>{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Customer Card */}
          <div className="p-6 border border-gray-100 rounded-2xl flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
              <User size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-gray-900">Customer</h3>
              <p className="text-sm text-gray-600">Full Name: {order.user?.fullName}</p>
              <p className="text-sm text-gray-600">Email: {order.user?.email}</p>
              <p className="text-sm text-gray-600">Phone: {order.deliveryAddress?.phone}</p>
              <button className="mt-4 w-full bg-black text-white py-2 rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors">
                View profile
              </button>
            </div>
          </div>

          {/* Order Info Card */}
          <div className="p-6 border border-gray-100 rounded-2xl flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-xl ${order.paymentMethod?.toLowerCase() === 'cod' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
              {order.paymentMethod?.toLowerCase() === 'cod' ? <Banknote size={24} /> : <CreditCard size={24} />}
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-gray-900">Payment Setup</h3>
              <p className="text-sm text-gray-600 font-medium">Method: <span className="uppercase">{order.paymentMethod || 'Razorpay'}</span></p>
              <p className="text-sm text-gray-600 italic">Status: <span className="font-bold">{order.paymentStatus || 'Pending'}</span></p>
            </div>
          </div>

          {/* Deliver To Card */}
          <div className="p-6 border border-gray-100 rounded-2xl flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
              <MapPin size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-gray-900">Deliver To</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Address: {order.deliveryAddress?.street},<br/>
                {order.deliveryAddress?.city}, {order.deliveryAddress?.state},<br/>
                {order.deliveryAddress?.pincode}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Info Overlay/Small Card */}
        <div className="p-6 bg-gray-50/50 border border-gray-100 rounded-2xl max-w-sm space-y-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
             <ShieldCheck size={18} className="text-emerald-500" />
             Payment Verification
          </h3>
          <div className="flex items-center gap-3">
            {order.paymentMethod?.toLowerCase() === 'cod' ? (
              <>
                 <Banknote size={20} className="text-orange-500" />
                 <span className="text-sm font-bold text-gray-900 uppercase tracking-widest">Cash on Delivery</span>
              </>
            ) : (
              <>
                 <CreditCard size={20} className="text-indigo-500" />
                 <span className="text-sm font-bold text-gray-900 uppercase tracking-widest">Razorpay Online (Paid)</span>
              </>
            )}
          </div>
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            {order.paymentMethod === 'cod' ? 'Payment expected at delivery time' : 'Transaction ID: Verified'}
          </div>
        </div>
      </div>

      {/* Tracking Visualization Section */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="relative flex items-center justify-between mb-12">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-500"
            style={{ width: `${(Math.max(0, currentStep) / (statusSteps.length - 1)) * 100}%` }}
          ></div>

          {statusSteps.map((step, idx) => {
            const isActive = idx <= currentStep;
            return (
              <div key={idx} className="relative z-10 flex flex-col items-center gap-3">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all ${
                    isActive ? 'bg-blue-600 text-white border-blue-100' : 'bg-white text-gray-300 border-gray-50'
                  }`}
                >
                  {isActive ? step.icon : <span className="font-bold">{idx + 1}</span>}
                </div>
                <span className={`text-xs font-bold ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="space-y-6">
          <h3 className="font-bold text-gray-900">Tracking Status</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-gray-400 uppercase font-black tracking-widest border-b border-gray-50">
                  <th className="pb-4">Date</th>
                  <th className="pb-4">Time</th>
                  <th className="pb-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <tr className="text-sm text-gray-600">
                  <td className="py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-4">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="py-4 font-medium text-gray-900">Order received</td>
                </tr>
                {/* Simulated tracking history */}
                {order.status !== 'pending' && (
                   <tr className="text-sm text-gray-600">
                    <td className="py-4">{new Date().toLocaleDateString()}</td>
                    <td className="py-4">10:45 AM</td>
                    <td className="py-4 font-medium text-gray-900">Order Processed</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Update Tracking Details Form */}
        {!isFinalized ? (
          <div className="mt-12 p-8 bg-gray-50/50 rounded-3xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900">Update Tracking Details</h3>
              {availableOptions.length === 0 && !isFinalized && (
                <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                  No further transitions available
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tracking Status</label>
                  <select 
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value)}
                    disabled={availableOptions.length === 0}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-black outline-none disabled:opacity-50 disabled:bg-gray-100"
                  >
                    <option value={order.status}>Current: {order.status}</option>
                    {availableOptions.map(opt => (
                      <option key={opt} value={opt}>Move to: {opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Date</label>
                    <input type="date" className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm" defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Time</label>
                    <input type="time" className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm" defaultValue="10:45" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Updated By</label>
                  <input type="text" className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-400" disabled value="Admin" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description/Note</label>
                <textarea 
                  rows="6"
                  placeholder="Enter some notes about the shipment..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-1 focus:ring-black outline-none resize-none"
                ></textarea>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              {order.status !== 'cancelled' && (
                <button 
                  onClick={() => handleUpdateStatus('cancelled')}
                  className="px-8 py-3 rounded-xl border border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 transition-all"
                >
                  Cancel Order
                </button>
              )}
              
              <button 
                onClick={() => handleUpdateStatus()}
                disabled={availableOptions.length === 0 || updateStatus === order.status}
                className="bg-black text-white px-12 py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
              >
                {order.status === 'cancelled' && order.paymentMethod?.toLowerCase() !== 'cod' ? 'Process Refund' : 'Save Update'}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-12 p-10 bg-green-50/50 rounded-3xl border border-green-100 text-center">
             <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
             </div>
             <h3 className="text-lg font-bold text-gray-900">This order is finalized</h3>
             <p className="text-gray-500 text-sm mt-1">Status: <span className="font-bold text-gray-900 uppercase tracking-widest">{order.status}</span></p>
          </div>
        )}
      </div>

      {/* Products Summary Card */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
        <h3 className="font-bold text-gray-900">Products</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 uppercase font-black tracking-widest border-b border-gray-50">
                <th className="pb-4 text-left">Product Name</th>
                <th className="pb-4 text-center">Quantity</th>
                <th className="pb-4 text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {order.items.map((item, idx) => (
                <tr key={idx} className="text-sm font-medium text-gray-900">
                  <td className="py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-center text-gray-600">{item.quantity}</td>
                  <td className="py-4 text-right">₹{item.price.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-50">
          <div className="w-full md:w-64 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-bold">₹{order.totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Discount</span>
              <span className="font-bold text-green-600">- ₹0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Shipping</span>
              <span className="font-bold text-green-600">FREE</span>
            </div>
            <div className="flex justify-between text-lg pt-3 border-t border-gray-100">
              <span className="font-black text-gray-900">Total</span>
              <span className="font-black text-gray-900">₹{order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
