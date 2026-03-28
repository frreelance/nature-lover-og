"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  ShoppingCart, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  TrendingUp
} from 'lucide-react';
import api from '@/api/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/api/admin/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      if (error.response?.status === 403 || error.response?.status === 401) {
        router.push('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex h-96 items-center justify-center animate-pulse">Loading dashboard...</div>;

  const statCards = stats ? [
    { title: 'Total Orders', value: stats.totalOrders.toLocaleString(), icon: ShoppingCart, color: 'bg-purple-100 text-purple-600' },
    { title: 'Pending Orders', value: stats.pendingOrders.toLocaleString(), icon: Clock, color: 'bg-orange-100 text-orange-600' },
    { title: 'Completed', value: stats.completedOrders.toLocaleString(), icon: CheckCircle, color: 'bg-green-100 text-green-600' },
    { title: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-indigo-100 text-indigo-600' },
    { title: "Today's Volume", value: stats.todayOrders.toLocaleString(), icon: TrendingUp, color: 'bg-blue-100 text-blue-600' },
    { title: 'Active Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'bg-purple-100 text-purple-600' }
  ] : [];

  return (
    <div className="space-y-8 animate-fade-in">


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 flex items-center justify-between group">
            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.title}</p>
              <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
            </div>
            <div className={`${stat.color.split(' ')[0]} p-4 rounded-2xl shadow-sm group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} className={stat.color.split(' ')[1]} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="divide-y">
          {stats?.recentOrders?.map((order) => (
            <div key={order._id} className="py-4 flex justify-between items-center hover:bg-gray-50 px-2 rounded-xl transition-colors cursor-pointer" onClick={() => router.push('/admin/orders')}>
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-700">#{order._id.slice(-4)}</div>
                <div>
                  <p className="font-bold text-gray-800">{order.user?.fullName || 'N/A'}</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()} • {order.totalItems} items</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">₹{order.totalAmount}</p>
                <span className="text-xs font-bold uppercase tracking-wider">{order.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
