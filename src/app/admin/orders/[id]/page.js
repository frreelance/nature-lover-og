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
  Calendar
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

  const handleUpdateStatus = async () => {
    try {
      await api.patch(`/api/admin/orders/${id}`, { 
        status: updateStatus,
        note: note 
      });
      toast.success('Order status updated successfully');
      fetchOrderDetails();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

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
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
              <Truck size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-gray-900">Order Info</h3>
              <p className="text-sm text-gray-600">Shipping: Next Express</p>
              <p className="text-sm text-gray-600">Payment Method: Card</p>
              <p className="text-sm text-gray-600">Status: {order.status}</p>
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
        <div className="p-6 border border-gray-100 rounded-2xl max-w-sm space-y-4">
          <h3 className="font-bold text-gray-900">Payment Info</h3>
          <div className="flex items-center gap-3">
            <CreditCard size={20} className="text-red-500" />
            <span className="text-sm text-gray-600">Master Card **** **** 6557</span>
          </div>
          <div className="text-sm text-gray-600">
            <p>Business name: {order.user?.fullName}</p>
            <p>Phone: {order.deliveryAddress?.phone}</p>
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
        <div className="mt-12 p-8 bg-gray-50/50 rounded-3xl border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6">Update Tracking Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tracking Status</label>
                <select 
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value)}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-black outline-none"
                >
                  <option value="pending">Received</option>
                  <option value="processed">Processed</option>
                  <option value="shipped">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
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
          <div className="mt-8 flex justify-center">
            <button 
              onClick={handleUpdateStatus}
              className="bg-black text-white px-12 py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95"
            >
              Save Update
            </button>
          </div>
        </div>
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
              <span className="text-gray-500">Tax (7%)</span>
              <span className="font-bold">₹{(order.totalAmount * 0.07).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Discount</span>
              <span className="font-bold">₹0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Shipping</span>
              <span className="font-bold text-green-600">FREE</span>
            </div>
            <div className="flex justify-between text-lg pt-3 border-t border-gray-100">
              <span className="font-black text-gray-900">Total</span>
              <span className="font-black text-gray-900">₹{(order.totalAmount * 1.07).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
