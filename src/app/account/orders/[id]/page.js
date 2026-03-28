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
    Calendar, Truck, CheckCircle2, ShoppingBag, X
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
    const [isCancelling, setIsCancelling] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

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
            case 'delivered': 
                return { label: 'Delivered', dot: 'bg-green-500', text: 'text-green-600', pill: 'bg-green-50' };
            case 'shipped': 
                return { label: 'Shipped', dot: 'bg-blue-500', text: 'text-blue-600', pill: 'bg-blue-50' };
            case 'cancelled': 
                return { label: 'Cancelled', dot: 'bg-red-500', text: 'text-red-500', pill: 'bg-red-50' };
            default: 
                return { label: 'Pending', dot: 'bg-orange-500', text: 'text-orange-500', pill: 'bg-orange-50' };
        }
    };

    const handleCancelOrder = async () => {
        setIsCancelling(true);
        const loadingToast = toast.loading('Processing cancellation...');
        try {
            const response = await api.patch(`/api/orders/${id}`, { status: 'cancelled' });
            if (response.data.success) {
                toast.success('Order cancelled successfully', { id: loadingToast });
                setShowCancelModal(false);
                loadOrder();
            } else {
                toast.error(response.data.message || 'Cancellation failed', { id: loadingToast });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error cancelling order', { id: loadingToast });
        } finally {
            setIsCancelling(false);
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
                        
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 w-full sm:w-auto">
                              {order.status === 'pending' && (
                                  <button 
                                      onClick={() => setShowCancelModal(true)}
                                      disabled={isCancelling}
                                      className="flex-1 sm:flex-none px-4 sm:px-8 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl sm:rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                  >
                                      {isCancelling ? <Loader2 size={12} className="animate-spin" /> : null}
                                      Cancel Order
                                  </button>
                              )}
                              <div className="flex gap-2 flex-1 sm:flex-none">
                                <button className="flex-1 sm:flex-none p-3 bg-white border border-gray-100 rounded-xl sm:rounded-2xl hover:bg-black hover:text-white transition-all shadow-sm active:scale-95 flex items-center justify-center">
                                    <Printer size={16} />
                                </button>
                                <button className="flex-[3] sm:flex-none flex items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-black text-white rounded-xl sm:rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all active:scale-95">
                                    <span className="hidden xs:inline">Invoice</span> <Download size={14} />
                                </button>
                              </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Left Column: Tracking & Content */}
                    <div className="lg:col-span-8 space-y-12">
                        
                        {/* Status Card */}
                        <div className="bg-white border border-gray-100 rounded-3xl md:rounded-[3rem] p-6 sm:p-10 md:p-14 shadow-sm border border-gray-100 relative overflow-hidden">
                             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 md:mb-14 relative z-10">
                                 <div className="space-y-2">
                                     <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full w-fit ${theme.pill} ${theme.text}`}>
                                         <div className={`w-1.5 h-1.5 rounded-full ${theme.dot} animate-pulse`} />
                                         <span className="text-[9px] font-bold uppercase tracking-wide">{theme.label}</span>
                                     </div>
                                     <p className="text-[9px] font-black uppercase tracking-widest text-gray-300">Updated: {new Date(order.updatedAt).toLocaleDateString()}</p>
                                 </div>
                                 <div className="sm:text-right">
                                     <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Expected Arrival</p>
                                     <p className="text-base font-bold text-gray-900">{estimatedArrival.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                 </div>
                             </div>

                             {/* Shipment Progress Mock */}
                             <div className="relative pt-4 px-2">
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-50 -translate-y-1/2 rounded-full" />
                                <div className={`absolute top-1/2 left-0 h-1 bg-black -translate-y-1/2 rounded-full transition-all duration-1000 ${order.status === 'delivered' ? 'w-full' : (order.status === 'shipped' ? 'w-2/3' : 'w-1/3')}`} />
                                
                                <div className="relative flex justify-between">
                                    <div className="flex flex-col items-center gap-4 bg-white px-2 z-10">
                                        <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-lg"><Package size={16}/></div>
                                        <p className="text-[9px] font-bold uppercase tracking-widest">Ordered</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-4 bg-white px-2 z-10">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${['shipped', 'delivered'].includes(order.status) ? 'bg-black text-white shadow-lg' : 'bg-gray-50 text-gray-200'}`}><Truck size={16}/></div>
                                        <p className="text-[9px] font-bold uppercase tracking-widest">Shipped</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-4 bg-white px-2 z-10">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${order.status === 'delivered' ? 'bg-green-600 text-white shadow-lg ring-4 ring-green-50' : 'bg-gray-50 text-gray-200'}`}><CheckCircle2 size={16}/></div>
                                        <p className="text-[9px] font-bold uppercase tracking-widest">Delivered</p>
                                    </div>
                                </div>
                             </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-4 sm:space-y-6">
                            <h4 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-[#D0D0D0] border-l-4 border-black pl-4">Packed Essentials ({order.items.length})</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] border border-gray-100 flex items-center gap-4 md:gap-6 hover:shadow-xl hover:-translate-y-1 transition-all group">
                                        <div className="w-16 h-16 md:w-24 md:h-24 rounded-xl md:rounded-2xl overflow-hidden bg-gray-50 border border-gray-50 flex-shrink-0 shadow-sm">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        </div>
                                        <div className="flex-1 space-y-1 min-w-0">
                                            <h5 className="text-[13px] md:text-[14px] font-bold text-gray-900 truncate uppercase tracking-tighter italic">{item.name}</h5>
                                            <div className="flex items-center gap-2">
                                                     <span className="text-[9px] font-bold text-[#A0A0A0] tracking-widest uppercase">{formatPrice(item.price)} <span className="opacity-70">x{item.quantity}</span></span>
                                            </div>
                                            <p className="text-base md:text-lg font-black text-gray-900 pt-1">{formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Billing & Address */}
                    <div className="lg:col-span-4 space-y-8 md:space-y-10">
                        {/* Address Block */}
                        <div className="space-y-4 md:space-y-6">
                            <h4 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-[#D0D0D0] border-l-4 border-black pl-4">Delivery Point</h4>
                            <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 md:space-y-8">
                                <div className="flex gap-4 md:gap-5">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 rounded-xl md:rounded-2xl flex items-center justify-center text-gray-400 flex-shrink-0"><MapPin size={20} /></div>
                                    <div className="space-y-1 pt-1">
                                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">Street Mapping</p>
                                        <p className="text-xs md:text-sm font-bold text-gray-900 leading-snug">{order.deliveryAddress?.street}</p>
                                        <p className="text-[10px] font-semibold text-gray-400 uppercase">{order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.pincode}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 md:gap-5 pt-6 border-t border-gray-50">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 rounded-xl md:rounded-2xl flex items-center justify-center text-gray-400 flex-shrink-0"><Phone size={20} /></div>
                                    <div className="space-y-1 pt-1">
                                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">Connect Support</p>
                                        <p className="text-xs md:text-sm font-bold text-gray-900">{order.contactInfo?.phone}</p>
                                        <p className="text-[10px] font-bold text-gray-400 truncate tracking-tight">{order.contactInfo?.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bill Summary */}
                        <div className="space-y-4 md:space-y-6">
                            <h4 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-[#D0D0D0] border-l-4 border-black pl-4">Billing Digest</h4>
                            <div className="bg-white p-8 md:p-10 rounded-2xl md:rounded-[3rem] border border-gray-100 shadow-sm space-y-5 md:space-y-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 md:p-10 opacity-[0.03] text-black group-hover:scale-110 transition-transform duration-1000 select-none"><ShoppingBag size={100} /></div>
                                
                                <div className="space-y-3 md:space-y-4 relative z-10">
                                    <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400">
                                        <span>Subtotal</span>
                                        <span className="text-gray-900">{formatPrice(order.totalAmount)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-[0.15em] text-green-600">
                                        <span>Logistics</span>
                                        <span>FREE</span>
                                    </div>
                                    <div className="h-px bg-gray-50 my-4" />
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-300">Total Payable</p>
                                        <div className="flex justify-between items-end">
                                            <span className="text-xl md:text-2xl font-black text-gray-900">{formatPrice(order.totalAmount)}</span>
                                            <span className="text-[9px] font-black text-green-600 uppercase tracking-widest pb-1 flex items-center gap-1">
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

            {/* Custom Cancellation Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl border border-gray-100 animate-slide-up">
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-8 mx-auto">
                            <X size={32} strokeWidth={3} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 text-center uppercase tracking-tighter mb-4">Cancel Shipment?</h3>
                        <p className="text-sm font-medium text-gray-400 text-center leading-relaxed mb-10">
                            This action is permanent. Your items will be released back to the inventory and the order will be permanently marked as cancelled.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={handleCancelOrder}
                                disabled={isCancelling}
                                className="w-full py-5 bg-black text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isCancelling && <Loader2 size={14} className="animate-spin" />}
                                Confirm Cancellation
                            </button>
                            <button 
                                onClick={() => setShowCancelModal(false)}
                                disabled={isCancelling}
                                className="w-full py-5 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                            >
                                Keep Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetailsPage;
