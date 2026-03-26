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
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search orders..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border rounded-xl" />
          </div>
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="border rounded-xl px-4 py-2">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredOrders.map(order => (
              <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium">#{order._id.slice(-6)}</td>
                <td className="px-6 py-4">{order.user?.fullName || 'N/A'}</td>
                <td className="px-6 py-4 font-bold text-green-600">₹{order.totalAmount}</td>
                <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>{order.status}</span></td>
                <td className="px-6 py-4"><button onClick={()=>viewOrderDetails(order._id)} className="text-gray-400 hover:text-green-600"><Eye size={20}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Update Order #{selectedOrder._id.slice(-6)}</h2>
              <button onClick={()=>setShowModal(false)}><X/></button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {['pending', 'confirmed', 'processing', 'completed', 'cancelled'].map(s => (
                  <button key={s} onClick={()=>updateOrderStatus(selectedOrder._id, s)} className={`p-4 rounded-xl border font-bold capitalize transition-all ${selectedOrder.status === s ? 'bg-green-600 text-white border-green-600' : 'hover:border-green-600 text-gray-600'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
