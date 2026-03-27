"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/utils/ScrollToTop';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ChevronRight, Package, Truck, CheckCircle, XCircle, MapPin, Calendar, ArrowRight, Dot } from 'lucide-react';
import api from '@/api/api';

const Orders = () => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('shipping');

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
            if (response.data.success) {
                setOrders(response.data.data.orders || []);
            }
        } catch (error) {
            console.error('Error loading orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTabOrders = () => {
        switch (activeTab) {
            case 'shipping':
                return orders.filter(o => ['pending', 'confirmed', 'processing'].includes(o.status));
            case 'arrived':
                return orders.filter(o => o.status === 'completed');
            case 'canceled':
                return orders.filter(o => o.status === 'cancelled');
            default:
                return [];
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const getStatusTheme = (status) => {
        switch (status) {
            case 'completed': return { label: 'Arrived', color: 'text-green-600', bg: 'bg-green-50', dot: 'bg-green-600' };
            case 'cancelled': return { label: 'Canceled', color: 'text-red-500', bg: 'bg-red-50', dot: 'bg-red-500' };
            default: return { label: 'On Delivering', color: 'text-orange-500', bg: 'bg-orange-50', dot: 'bg-orange-500' };
        }
    };

    if (!isAuthenticated) return null;

    const filteredOrders = getTabOrders();

    return (
        <div className="min-h-screen bg-[#FDFDFD] font-inter">
            <ScrollToTop />
            <Header />

            <div className="max-w-3xl mx-auto px-4 pt-32 pb-40">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Orders</h1>
                </div>

                {/* Tabs Wrapper */}
                <div className="bg-white rounded-[2rem] p-2 border border-gray-100 shadow-sm flex mb-12 relative overflow-hidden">
                    {['shipping', 'arrived', 'canceled'].map((tab) => {
                        const count = orders.filter(o => {
                            if (tab === 'shipping') return ['pending', 'confirmed', 'processing'].includes(o.status);
                            if (tab === 'arrived') return o.status === 'completed';
                            return o.status === 'cancelled';
                        }).length;

                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-3xl transition-all duration-500 relative z-10 ${
                                    activeTab === tab 
                                    ? 'bg-[#1A1A1A] text-white shadow-xl translate-y-[-2px]' 
                                    : 'text-gray-400 font-semibold hover:text-black'
                                }`}
                            >
                                <span className="text-sm font-bold uppercase tracking-widest pt-0.5">
                                    {tab === 'shipping' ? 'On Shipping' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </span>
                                {count > 0 && (
                                    <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-black ${activeTab === tab ? 'bg-white text-black' : 'bg-gray-100 text-gray-400'}`}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {loading ? (
                    <div className="space-y-8">
                        {[1, 2].map(i => (
                            <div key={i} className="bg-white h-64 rounded-[2.5rem] animate-pulse border border-gray-50" />
                        ))}
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                           <ShoppingBag className="h-10 w-10 text-gray-200" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2 capitalize">No {activeTab} Orders</h2>
                        <p className="text-gray-400 text-sm mb-8 font-medium italic">Ready to find some new nature companions?</p>
                        <button onClick={() => router.push('/plants')} className="bg-black text-white px-8 py-3.5 rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg hover:shadow-xl transition-all active:scale-95">
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {filteredOrders.map((order) => {
                            const theme = getStatusTheme(order.status);
                            const estDate = order.estimatedDeliveryDate 
                                ? new Date(order.estimatedDeliveryDate) 
                                : new Date(new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000);

                            return (
                                <div key={order._id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden animate-fade-in group">
                                    {/* Order Header */}
                                    <div className="px-8 pt-8 pb-6 flex items-center justify-between border-b border-gray-50">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-50 rounded-xl">
                                                <ShoppingBag size={18} className="text-gray-400" />
                                            </div>
                                            <div>
                                                 <h3 className="text-sm font-black text-gray-900 group-hover:text-green-800 transition-colors uppercase tracking-widest italic">{order._id.slice(-8).toUpperCase()}</h3>
                                                 <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-1">Placed: {new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full ${theme.bg} ${theme.color}`}>
                                             <div className={`w-1.5 h-1.5 rounded-full ${theme.dot} animate-pulse`} />
                                             <span className="text-[10px] font-black uppercase tracking-widest">{theme.label}</span>
                                        </div>
                                    </div>

                                    {/* Delivery Timeline Block */}
                                    <div className="px-8 py-8 bg-gray-50/30">
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
                                            {/* Track Points */}
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 flex-shrink-0">
                                                    <Truck size={14} className="text-gray-400" />
                                                </div>
                                                <p className="text-[11px] font-bold text-gray-500 truncate uppercase">Hisar, HR, India</p>
                                            </div>

                                            {/* Line (Desktop Only) */}
                                            <div className="hidden md:flex flex-1 items-center gap-2 justify-center">
                                                <div className="h-[2px] w-6 bg-gray-100 rounded-full" />
                                                <div className="flex gap-1.5">
                                                    {[1,2,3,4].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-100" />)}
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Estimate</p>
                                                    <p className="text-[10px] font-bold text-gray-900 bg-white px-3 py-1 rounded-lg border border-gray-50 shadow-sm">{estDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                                </div>
                                                <div className="flex gap-1.5">
                                                    {[1,2,3,4].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-100" />)}
                                                </div>
                                                <div className="h-[2px] w-6 bg-gray-100 rounded-full" />
                                                <ArrowRight size={14} className="text-gray-300" />
                                            </div>

                                            {/* Destination */}
                                            <div className="flex items-center gap-3 justify-end flex-1 min-w-0">
                                                <p className="text-[11px] font-black text-gray-900 truncate uppercase tracking-tight italic">{order.deliveryAddress?.city}, {order.deliveryAddress?.state}</p>
                                                <div className="p-2 bg-black rounded-xl shadow-lg flex-shrink-0">
                                                    <MapPin size={14} className="text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Product List */}
                                    <div className="px-8 py-4 space-y-4">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex gap-5 p-4 rounded-3xl bg-white border border-gray-50 group/item hover:border-gray-100 transition-colors">
                                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.25rem] overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 shadow-sm">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover/item:scale-105 transition-transform" />
                                                </div>
                                                <div className="flex-1 py-1 flex flex-col justify-between">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="text-[13px] font-bold text-gray-900 group-hover/item:text-green-800 transition-colors uppercase italic tracking-tighter line-clamp-1">{item.name}</h4>
                                                            <div className="flex items-center gap-3 mt-1.5 text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                                                                <span>{formatPrice(item.price)} <span className="text-[8px] opacity-70">x{item.quantity}</span></span>
                                                                {(item.size || item.duration) && (
                                                                    <>
                                                                        <Dot size={12} className="text-gray-200" />
                                                                        <span className="text-gray-300">{item.size || item.duration}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-900 font-black tracking-tighter text-sm whitespace-nowrap">{formatPrice(item.price * item.quantity)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Footer */}
                                    <div className="px-8 py-8 flex items-center justify-between border-t border-gray-50 animate-fade-in delay-200">
                                         <div>
                                             <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">Total Payment</p>
                                             <span className="text-xl font-black text-gray-900 tracking-tighter uppercase">{formatPrice(order.totalAmount)}</span>
                                         </div>
                                         <button 
                                            onClick={() => router.push(`/orders/${order._id}`)}
                                            className="bg-gray-50 hover:bg-black hover:text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-sm"
                                         >
                                             Details
                                         </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            
            <Footer />
        </div>
    );
};

export default Orders;
