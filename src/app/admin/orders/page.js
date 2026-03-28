"use client";
import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { Search, Filter, Eye, Edit2, Trash2, Package, Calendar, X, ArrowUpRight } from 'lucide-react';
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
      pending: 'bg-yellow-50 text-yellow-700 border border-yellow-100',
      shipped: 'bg-blue-50 text-blue-700 border border-blue-100',
      delivered: 'bg-green-50 text-green-700 border border-green-100',
      cancelled: 'bg-red-50 text-red-700 border border-red-100'
    };
    return colors[status] || 'bg-gray-50 text-gray-700 border border-gray-100';
  };

  const filteredOrders = orders.filter(order =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Toaster />
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-6">
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
                type="text" 
                placeholder="Search orders..." 
                value={searchTerm} 
                onChange={e=>setSearchTerm(e.target.value)} 
                className="w-full pl-12 pr-4 py-3 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-purple-100 outline-none bg-white shadow-sm transition-all" 
            />
          </div>
          <select 
            value={statusFilter} 
            onChange={e=>setStatusFilter(e.target.value)} 
            className="border border-gray-100 shadow-sm rounded-2xl px-6 py-3 text-sm font-semibold bg-white outline-none cursor-pointer hover:border-purple-200 transition-colors"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 text-xs font-semibold text-gray-500 border-b border-gray-100">
              <th className="px-6 py-4">Order Details</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredOrders.map(order => (
              <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Package size={18} className="text-purple-600" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{order.user?.fullName || 'Anonymous'}</p>
                    <p className="text-xs text-gray-500">{order.user?.email || 'N/A'}</p>
                </td>
                <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-900">₹{order.totalAmount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{order.items.length} items</p>
                </td>
                <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                </td>
                <td className="px-6 py-4 text-center">
                    <Link 
                        href={`/admin/orders/${order._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-purple-600 hover:text-white border border-purple-200 hover:bg-purple-600 rounded-lg transition-all"
                    >
                        Review Order
                        <ArrowUpRight size={14} />
                    </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default AdminOrders;
