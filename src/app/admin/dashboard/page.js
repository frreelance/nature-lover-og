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
import RecentActivity from '@/components/admin/RecentActivity';

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

  const mockActivities = [
    { type: 'payment', description: 'Renewed account with BB_10MBPS_2M plan', timestamp: '28-12-2024 12:34 PM' },
    { type: 'issue_closed', description: 'Closed issue #12345', timestamp: '26-11-2024 08:47 PM' },
    { type: 'issue_opened', description: 'Opened issue #123456', timestamp: '24-11-2024 11:13 PM' },
    { type: 'plan_change', description: 'Changed plan to BB_10MBPS_2M', timestamp: '31-12-2024 09:22 AM' },
    { type: 'user_added', description: 'Customer was added by @johndoe', timestamp: '06-09-2024 12:39 PM' },
  ];

  const recentActivities = [
    ...(stats?.recentOrders?.map(order => ({
      id: order._id,
      type: order.status === 'delivered' ? 'issue_closed' : 'payment',
      description: `Order #${order._id.slice(-5).toUpperCase()} ${order.status} for ${order.user?.fullName || 'Customer'}`,
      timestamp: new Date(order.createdAt).toLocaleString('en-IN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      }).replace(/\//g, '-')
    })) || []),
    ...mockActivities
  ].slice(0, 6);

  return (
    <div className="space-y-8 animate-fade-in p-4 lg:p-0">


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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Content Area (e.g., charts or detailed tables could go here) */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-[500px] flex items-center justify-center text-gray-400">
             <div className="text-center group cursor-default">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp size={32} className="text-indigo-400" />
                </div>
                <p className="font-bold text-gray-500">Sales Overview Chart Placeholder</p>
                <p className="text-sm">Real-time data visualization coming soon</p>
             </div>
          </div>
        </div>
        
        <div className="lg:col-span-1 h-full">
          <RecentActivity activities={recentActivities} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
