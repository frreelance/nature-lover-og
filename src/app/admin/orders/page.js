"use client";
import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Search, Filter, Eye, Edit2, Trash2, Package, Calendar, X } from 'lucide-react';
import api from '@/api/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, totalPages: 1 });

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, pagination.page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/orders', {
        params: {
          status: statusFilter === 'all' ? undefined : statusFilter,
          page: pagination.page,
          limit: pagination.limit
        }
      });
      setOrders(response.data.data.orders);
      setPagination(prev => ({ ...prev, ...response.data.data.pagination }));
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/api/admin/orders/${orderId}`, { status: newStatus });
      fetchOrders();
      setShowModal(false);
      toast.success(`Order status updated to ${newStatus}!`);
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const response = await api.get(`/api/admin/orders/${orderId}`);
      setSelectedOrder(response.data.data);
      setShowModal(true);
    } catch (error) {
      toast.error('Failed to fetch details');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      shipped: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredOrders = orders.filter(order =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Toaster />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Purchase Logistics</h1>
          <p className="text-gray-500 text-sm">Track shipments and update delivery statuses</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
                type="text" 
                placeholder="Search orders..." 
                value={searchTerm} 
                onChange={e=>setSearchTerm(e.target.value)} 
                className="pl-10 pr-4 py-2 border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-black outline-none bg-gray-50/50" 
            />
          </div>
          <select 
            value={statusFilter} 
            onChange={e=>setStatusFilter(e.target.value)} 
            className="border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest bg-gray-50/50 outline-none cursor-pointer"
          >
            <option value="all">Everything</option>
            <option value="pending">Ordered</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">
              <th className="px-6 py-4">Transaction Hub</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Financials</th>
              <th className="px-6 py-4">Logistics</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredOrders.map(order => (
              <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <Package size={14} className="text-gray-300" />
                    <div>
                        <p className="text-sm font-bold text-gray-900 leading-tight">Order Log</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter italic">#{order._id.slice(-8)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3">
                    <p className="text-sm font-bold text-gray-900 leading-tight">{order.user?.fullName || 'Anonymous'}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="px-6 py-3">
                    <p className="text-sm font-black text-gray-900">₹{order.totalAmount}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{order.items.length} Units</p>
                </td>
                <td className="px-6 py-3">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                        {order.status}
                    </span>
                </td>
                <td className="px-6 py-3 text-center">
                    <button 
                        onClick={()=>viewOrderDetails(order._id)} 
                        className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                    >
                        Review Order
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
          <div className="bg-white rounded-[2.5rem] max-w-2xl w-full shadow-2xl overflow-hidden animate-scale-in">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Logistics Dashboard</p>
                <h2 className="text-xl font-bold text-gray-900 italic uppercase italic tracking-tighter">Order #{selectedOrder._id.slice(-12)}</h2>
              </div>
              <button 
                onClick={()=>setShowModal(false)}
                className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm group"
              >
                <X size={20} className="text-gray-400 group-hover:text-black" />
              </button>
            </div>

            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {/* Progress Tracker */}
              <div className="grid grid-cols-4 gap-2">
                {['pending', 'shipped', 'delivered', 'cancelled'].map(s => (
                  <button 
                    key={s} 
                    onClick={()=>updateOrderStatus(selectedOrder._id, s)} 
                    className={`p-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${selectedOrder.status === s ? 'bg-black text-white border-black shadow-lg' : 'hover:border-black text-gray-400 border-gray-100 hover:text-black'}`}
                  >
                    {s === 'pending' ? 'Ordered' : s}
                  </button>
                ))}
              </div>

              {/* Items Summary */}
              <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Package Contents</h4>
                  <div className="space-y-2">
                      {selectedOrder.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
                              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white shadow-sm flex-shrink-0">
                                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1">
                                  <p className="text-xs font-bold text-gray-900 capitalize">{item.name}</p>
                                  <p className="text-[10px] font-bold text-gray-400">Qty: {item.quantity} × ₹{item.price}</p>
                              </div>
                              <p className="text-xs font-black text-gray-900">₹{item.price * item.quantity}</p>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Shipping & Billing */}
              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-50">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-4">Coordinates</h4>
                      <p className="text-xs font-bold text-gray-900 leading-relaxed uppercase">
                          {selectedOrder.deliveryAddress.street}<br/>
                          {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.pincode}<br/>
                          Phone: {selectedOrder.deliveryAddress.phone}
                      </p>
                  </div>
                  <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-50 text-right flex flex-col justify-center">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-1">Grand Total</p>
                      <p className="text-3xl font-black text-gray-900 tracking-tighter">₹{selectedOrder.totalAmount}.00</p>
                  </div>
              </div>
            </div>

            <div className="p-8 bg-gray-50/30 flex gap-4">
                <button 
                    onClick={()=>updateOrderStatus(selectedOrder._id, 'cancelled')}
                    className="flex-1 py-4 rounded-2xl border border-red-100 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all"
                >
                    Void Transaction
                </button>
                <button 
                    onClick={()=>setShowModal(false)}
                    className="flex-1 py-4 rounded-2xl bg-black text-white text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                >
                    Dismiss View
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
