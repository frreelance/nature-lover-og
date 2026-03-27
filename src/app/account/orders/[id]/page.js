"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/utils/ScrollToTop';
import { useParams, useRouter } from 'next/navigation';
import { 
    Package, ArrowLeft, MapPin, 
    Phone, Mail, Clock, ChevronRight, 
    Dot, Loader2, Download, Printer,
    Calendar, Truck, CheckCircle2, ShoppingBag
} from 'lucide-react';
import api from '@/api/api';
import Link from 'next/link';
import toast from 'react-hot-toast';

const OrderDetailsPage = () => {
    const { id } = useParams();
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) router.push('/auth?mode=login');
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated && id) loadOrder();
    }, [isAuthenticated, id]);

    const loadOrder = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/api/orders`);
            if (response.data.success) {
                const foundOrder = response.data.data.orders.find(o => o._id === id);
                if (foundOrder) setOrder(foundOrder);
                else toast.error('Order not found');
            }
        } catch (error) {
            console.error('Error loading order:', error);
            toast.error('Failed to load order');
        } finally {
            setLoading(false);
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
            case 'completed': 
                return { label: 'Delivered', dot: 'bg-green-500', text: 'text-green-600', pill: 'bg-green-50' };
            case 'cancelled': 
                return { label: 'Cancelled', dot: 'bg-red-500', text: 'text-red-500', pill: 'bg-red-50' };
            default: 
                return { label: 'In transit', dot: 'bg-orange-500', text: 'text-orange-500', pill: 'bg-orange-50' };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FDFDFD]">
                <Header />
                <div className="flex flex-col items-center justify-center pt-64 space-y-4">
                    <Loader2 className="animate-spin text-gray-200" size={40} />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Retrieving Shipment</p>
                </div>
            </div>
        );
    }

    if (!order) return null;

    const theme = getStatusTheme(order.status);
    const estimatedArrival = order.estimatedDeliveryDate 
        ? new Date(order.estimatedDeliveryDate) 
        : new Date(new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000);

    return (
        <div className="min-h-screen bg-[#FDFDFD] font-inter">
            <ScrollToTop />
            <Header />

            <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-32 pb-40">
                
                {/* Back & Breadcrumb */}
                <div className="mb-12">
                    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#D0D0D0] mb-8">
                        <Link href="/account" className="hover:text-black">My Account</Link>
                        <ChevronRight size={10} strokeWidth={4} />
                        <span className="text-black">Shipment Details</span>
                    </nav>
                    
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4">
                            <button 
                                onClick={() => router.push('/account')}
                                className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                            >
                                <ArrowLeft size={14} strokeWidth={3} /> Return to Orders
                            </button>
                            <h1 className="text-3xl font-bold text-[#1A1A1A] leading-tight">Order #{order._id.slice(-10).toUpperCase()}</h1>
                        </div>
                        
                        <div className="flex gap-3">
                             <button className="p-3.5 bg-white border border-gray-100 rounded-2xl hover:bg-black hover:text-white transition-all shadow-sm active:scale-95">
                                 <Printer size={18} />
                             </button>
                             <button className="flex items-center gap-3 px-8 py-3.5 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all active:scale-95">
                                 Download Invoice <Download size={14} />
                             </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Left Column: Tracking & Content */}
                    <div className="lg:col-span-8 space-y-12">
                        
                        {/* Status Card */}
                        <div className="bg-white border border-gray-100 rounded-[3rem] p-10 md:p-14 shadow-[0_30px_100px_rgba(0,0,0,0.04)] relative overflow-hidden">
                             <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-14 relative z-10">
                                 <div className="space-y-3">
                                     <div className={`flex items-center gap-3 px-4 py-2 rounded-full w-fit ${theme.pill} ${theme.text}`}>
                                         <div className={`w-2 h-2 rounded-full ${theme.dot} animate-pulse`} />
                                         <span className="text-[10px] font-bold uppercase tracking-wide">{theme.label}</span>
                                     </div>
                                     <p className="text-[11px] font-black uppercase tracking-widest text-gray-300">Last updated: {new Date(order.updatedAt).toLocaleDateString()}</p>
                                 </div>
                                 <div className="text-right">
                                     <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Expected Arrival</p>
                                     <p className="text-lg font-bold text-gray-900">{estimatedArrival.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                 </div>
                             </div>

                             {/* Shipment Progress Mock */}
                             <div className="relative pt-4 px-2">
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-50 -translate-y-1/2 rounded-full" />
                                <div className={`absolute top-1/2 left-0 h-1 bg-black -translate-y-1/2 rounded-full transition-all duration-1000 ${order.status === 'completed' ? 'w-full' : 'w-2/3'}`} />
                                
                                <div className="relative flex justify-between">
                                    <div className="flex flex-col items-center gap-4 bg-[#FDFDFD] px-2 z-10">
                                        <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-lg"><Package size={16}/></div>
                                        <p className="text-[9px] font-black uppercase tracking-widest">Ordered</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-4 bg-[#FDFDFD] px-2 z-10">
                                        <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-lg"><Clock size={16}/></div>
                                        <p className="text-[9px] font-black uppercase tracking-widest">Processed</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-4 bg-[#FDFDFD] px-2 z-10">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${['processing', 'completed'].includes(order.status) ? 'bg-black text-white shadow-lg' : 'bg-gray-50 text-gray-200'}`}><Truck size={16}/></div>
                                        <p className="text-[9px] font-black uppercase tracking-widest">Shipped</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-4 bg-[#FDFDFD] px-2 z-10">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${order.status === 'completed' ? 'bg-green-600 text-white shadow-lg ring-4 ring-green-50' : 'bg-gray-50 text-gray-200'}`}><CheckCircle2 size={16}/></div>
                                        <p className="text-[9px] font-black uppercase tracking-widest">Delivered</p>
                                    </div>
                                </div>
                             </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-6">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-300 border-l-4 border-black pl-5">Packed Essentials ({order.items.length})</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 flex gap-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
                                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 border border-gray-50 flex-shrink-0 shadow-sm">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        </div>
                                        <div className="flex-1 py-1 space-y-1.5 min-w-0">
                                            <h5 className="text-[14px] font-bold text-gray-900 truncate">{item.name}</h5>
                                            <div className="flex items-center gap-2.5">
                                                     <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">{formatPrice(item.price)} <span className="text-[8px] opacity-70">x{item.quantity}</span></span>
                                                     {(item.size || item.duration) && (
                                                         <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-[0.1em]">{item.size || item.duration}</span>
                                                     )}
                                            </div>
                                            <p className="text-lg font-bold text-gray-900 pt-3">{formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Billing & Address */}
                    <div className="lg:col-span-4 space-y-10">
                        {/* Address Block */}
                        <div className="space-y-6">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-300 border-l-4 border-black pl-5">Delivery Point</h4>
                            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8 animate-fade-in">
                                <div className="flex gap-5">
                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 flex-shrink-0"><MapPin size={24} /></div>
                                    <div className="space-y-1.5 pt-1">
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Street Mapping</p>
                                        <p className="text-sm font-bold text-gray-900 leading-snug">{order.deliveryAddress?.street}</p>
                                        <p className="text-xs font-semibold text-gray-400 pt-1 uppercase">{order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.pincode}</p>
                                    </div>
                                </div>
                                <div className="flex gap-5 pt-6 border-t border-gray-50">
                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 flex-shrink-0"><Phone size={24} /></div>
                                    <div className="space-y-1.5 pt-1">
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Connect Support</p>
                                        <p className="text-sm font-bold text-gray-900">{order.contactInfo?.phone}</p>
                                        <p className="text-xs font-bold text-gray-400 truncate tracking-tight">{order.contactInfo?.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bill Summary */}
                        <div className="space-y-6">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-300 border-l-4 border-black pl-5">Billing Digest</h4>
                            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-5 text-black group-hover:scale-125 transition-transform duration-1000"><ShoppingBag size={120} /></div>
                                
                                <div className="space-y-4 relative z-10">
                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                        <span>Items Subtotal</span>
                                        <span className="text-gray-900">{formatPrice(order.totalAmount - 40)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                        <span>Nature Logistics Fee</span>
                                        <span className="text-gray-900">₹40.00</span>
                                    </div>
                                    <div className="h-px bg-gray-50 my-6" />
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">Grand Total Paid</p>
                                        <div className="flex justify-between items-end">
                                            <span className="text-2xl font-bold text-gray-900 uppercase">{formatPrice(order.totalAmount)}</span>
                                            <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest pb-1.5 flex items-center gap-1">
                                                <CheckCircle2 size={12} /> Success
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    );
};

export default OrderDetailsPage;
