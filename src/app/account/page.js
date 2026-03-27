"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/utils/ScrollToTop';
import { useRouter } from 'next/navigation';
import { 
    User as UserIcon, ShoppingBag, Headset, 
    ChevronRight, ChevronDown, ChevronUp,
    Package, Clock, Truck, 
    Loader2, X, MapPin, Dot,
    Mail, Phone, HelpCircle, ShieldCheck,
    MessageSquare, Info, Shield, 
    Heart, FileText,
    Calendar, Camera, Edit2
} from 'lucide-react';
import api from '@/api/api';
import Link from 'next/link';

const AccountPage = () => {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('My Orders');
    const [orderFilter, setOrderFilter] = useState('All');
    
    // Profile Accordion Logic
    const [openProfileSection, setOpenProfileSection] = useState('Personal Info');

    // FAQ Logic
    const [faqCategory, setFaqCategory] = useState('General');
    const [openFaq, setOpenFaq] = useState(null);

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

    const sidebarItems = [
        { name: 'My Profile', icon: UserIcon },
        { name: 'My Orders', icon: ShoppingBag },
        { name: 'Customer Care', icon: Headset },
        { name: 'FAQs', icon: HelpCircle },
    ];

    const getStatusTheme = (status) => {
        switch (status) {
            case 'completed': return { label: 'Delivered', dot: 'bg-green-500', text: 'text-green-600', pill: 'bg-green-50' };
            case 'cancelled': return { label: 'Cancelled', dot: 'bg-red-500', text: 'text-red-500', pill: 'bg-red-50' };
            default: return { label: 'In progress', dot: 'bg-orange-500', text: 'text-orange-500', pill: 'bg-orange-50' };
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const getFilteredOrders = () => {
        if (orderFilter === 'All') return orders;
        return orders.filter(o => getStatusTheme(o.status).label === orderFilter);
    };

    const getUniqueAddresses = () => {
        const addresses = orders.map(o => o.deliveryAddress).filter(Boolean);
        const unique = Array.from(new Set(addresses.map(a => `${a.street}-${a.pincode}`)))
            .map(id => addresses.find(a => `${a.street}-${a.pincode}` === id));
        return unique;
    };

    const faqs = {
        General: [
            { q: "How long does delivery take?", a: "Most orders are delivered within 3-5 business days. You can track your shipment live in the My Orders section.", icon: Clock },
            { q: "Do you provide plant care instructions?", a: "Yes! Every plant shipment comes with a digital care guide. You can also contact our experts for maintenance tips.", icon: Info },
            { q: "What is your refund policy?", a: "If a plant arrives damaged, we offer a 24-hour replacement window. Please record an unboxing video for confirmation.", icon: Shield },
            { q: "Are your plants grown organically?", a: "Yes, all our plants are nurtured in our local Hisar nurseries using high-quality organic fertilisers.", icon: ShieldCheck }
        ],
        Dashboard: [
            { q: "How do I update my email?", a: "You can update your email in the 'Contact Info' section of your profile dashboard.", icon: Mail },
            { q: "Can I manage multiple addresses?", a: "Yes, once you place an order with a new address, it will be automatically stored in your Delivery Point history.", icon: MapPin }
        ],
        Support: [
            { q: "Who can I contact for garden design?", a: "Visit the Customer Care section to book a specialized consultation with our landscape architects.", icon: Headset },
            { q: "How do I track my service booking?", a: "Services can be tracked through the 'My Orders' section just like physical plant deliveries.", icon: Truck }
        ]
    };

    if (!isAuthenticated) return null;

    const filteredOrders = getFilteredOrders();
    const storedAddresses = getUniqueAddresses();

    return (
        <div className="min-h-screen bg-[#FDFDFD] font-sans selection:bg-green-100">
            <ScrollToTop />
            <Header />

            <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-32 pb-40">
                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* Sidebar */}
                    <aside className="w-full lg:w-72 flex-shrink-0">
                        <div className="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm sticky top-32">
                            <div className="space-y-1.5">
                                {sidebarItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = activeSection === item.name;
                                    return (
                                        <button
                                            key={item.name}
                                            onClick={() => setActiveSection(item.name)}
                                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-medium ${
                                                isActive 
                                                ? 'bg-[#1A1A1A] text-white shadow-lg shadow-black/10' 
                                                : 'text-gray-400 hover:text-black hover:bg-gray-50'
                                            }`}
                                        >
                                            <Icon size={18} />
                                            <span className="text-[13px] tracking-tight">{item.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        {/* Task 1: Profile UI - Personal Data Section */}
                        {activeSection === 'My Profile' && (
                            <div className="animate-fade-in max-w-4xl">
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">PERSONAL DATA</h1>
                                <p className="text-gray-400 text-sm mb-10">Enter your personal data so that you do not have to fill it in manually when placing an order.</p>

                                <div className="space-y-4">
                                    {/* Accordion Sections Mapping */}
                                    {[
                                        { id: 'Personal Info', icon: UserIcon },
                                        // { id: 'Security', icon: Shield },
                                        { id: 'Contact Info', icon: Mail },
                                        { id: 'Delivery address', icon: Truck },
                                        // { id: 'Interests', icon: Heart },
                                        // { id: 'Additional Info', icon: FileText }
                                    ].map((section) => (
                                        <div key={section.id} className="bg-white border border-gray-100 rounded-[1.5rem] overflow-hidden">
                                            <button 
                                                onClick={() => setOpenProfileSection(openProfileSection === section.id ? null : section.id)}
                                                className="w-full flex items-center justify-between p-6 hover:bg-gray-50/50 transition-colors"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <section.icon size={20} className="text-gray-900" />
                                                    <span className="text-[15px] font-bold text-gray-900">{section.id}</span>
                                                </div>
                                                {openProfileSection === section.id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                            </button>

                                            {openProfileSection === section.id && (
                                                <div className="p-8 pt-0 animate-slide-down">
                                                    {section.id === 'Personal Info' && (
                                                        <div className="space-y-8">
                                                            {/* User Image */}
                                                            <div className="relative group w-fit">
                                                                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-100 bg-gray-50">
                                                                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-300">
                                                                        {user?.name?.charAt(0)}
                                                                    </div>
                                                                </div>
                                                                <button className="absolute bottom-0 right-0 p-2 bg-gray-400 text-white rounded-full border-4 border-white shadow-sm hover:bg-black transition-colors">
                                                                    <Camera size={14} />
                                                                </button>
                                                            </div>

                                                            {/* Forms */}
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                                <div className="space-y-2">
                                                                    <label className="text-[11px] font-bold text-gray-400 ml-1">First Name*</label>
                                                                    <input type="text" readOnly value={user?.name?.split(' ')[0] || ''} className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50/30 text-sm font-medium" />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-[11px] font-bold text-gray-400 ml-1">Second Name*</label>
                                                                    <input type="text" readOnly value={user?.name?.split(' ').slice(1).join(' ') || ''} className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50/30 text-sm font-medium" />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-[11px] font-bold text-gray-400 ml-1">Nickname</label>
                                                                    <input type="text" placeholder="Not specified" className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-white text-sm font-medium" />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-[11px] font-bold text-gray-400 ml-1">Date of Birth</label>
                                                                    <div className="relative">
                                                                        <input type="text" placeholder="DD.MM.YYYY" className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-white text-sm font-medium" />
                                                                        <Calendar size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-[11px] font-bold text-gray-400 ml-1">Gender</label>
                                                                    <select className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-white text-sm font-medium appearance-none">
                                                                        <option>Male</option>
                                                                        <option>Female</option>
                                                                        <option>Other</option>
                                                                    </select>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-[11px] font-bold text-gray-400 ml-1">Country*</label>
                                                                    <select className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-white text-sm font-medium appearance-none">
                                                                        <option>India</option>
                                                                        <option>Others</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-end gap-3 pt-4">
                                                                <button className="px-8 py-3 rounded-full text-sm font-bold border border-gray-200 hover:bg-gray-50">Cancel</button>
                                                                <button className="px-8 py-3 rounded-full text-sm font-bold bg-[#1A1A1A] text-white hover:bg-black shadow-lg">Save Changes</button>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {section.id === 'Contact Info' && (
                                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                                                             <div className="space-y-2">
                                                                 <label className="text-[11px] font-bold text-gray-400">Email</label>
                                                                 <input type="text" readOnly value={user?.email || ''} className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm" />
                                                             </div>
                                                             <div className="space-y-2">
                                                                 <label className="text-[11px] font-bold text-gray-400">Phone Number</label>
                                                                 <input type="text" readOnly value={user?.phone || ''} className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm" />
                                                             </div>
                                                         </div>
                                                    )}
                                                    {section.id === 'Delivery address' && (
                                                         <div className="space-y-4 p-4">
                                                             {storedAddresses.length > 0 ? storedAddresses.map((addr, i) => (
                                                                 <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                                                     <div className="flex items-center gap-4">
                                                                         <MapPin size={16} className="text-gray-400" />
                                                                         <span className="text-xs font-medium text-gray-600 truncate">{addr.street}, {addr.city}</span>
                                                                     </div>
                                                                     <button className="text-[10px] font-bold uppercase text-gray-400">Default</button>
                                                                 </div>
                                                             )) : <p className="text-xs text-gray-400">No addresses found</p>}
                                                         </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeSection === 'My Orders' && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="flex flex-wrap items-center gap-3 pb-8 border-b border-gray-100">
                                    {['All', 'In Progress', 'Delivered', 'Cancelled'].map(pill => (
                                        <button
                                            key={pill}
                                            onClick={() => setOrderFilter(pill)}
                                            className={`px-7 py-3 rounded-full text-[11px] font-bold transition-all uppercase tracking-widest ${
                                                orderFilter === pill 
                                                ? 'bg-black text-white shadow-lg' 
                                                : 'bg-white border border-gray-100 text-[#A0A0A0] hover:border-gray-300'
                                            }`}
                                        >
                                            {pill}
                                        </button>
                                    ))}
                                </div>

                                {loading ? (
                                    <div className="space-y-6">
                                        {[1, 2].map(i => <div key={i} className="bg-white h-48 rounded-[2.5rem] animate-pulse border border-gray-50" />)}
                                    </div>
                                ) : filteredOrders.length === 0 ? (
                                    <div className="text-center py-40 border border-gray-100 rounded-[2rem]">
                                        <Package className="h-10 w-10 text-gray-200 mx-auto mb-6" />
                                        <p className="text-gray-400 font-medium text-sm">No orders yet</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-6">
                                        {filteredOrders.map((order) => {
                                            const theme = getStatusTheme(order.status);
                                            return (
                                                <div 
                                                    key={order._id} 
                                                    onClick={() => router.push(`/account/orders/${order._id}`)}
                                                    className="bg-white border border-gray-100 rounded-[2rem] p-6 hover:shadow-lg transition-all group cursor-pointer flex flex-col md:flex-row items-center gap-6"
                                                >
                                                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                                                        <img src={order.items[0]?.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                                    </div>
                                                    <div className="flex-1 min-w-0 space-y-1 text-center md:text-left">
                                                        <div className="flex items-center justify-center md:justify-start gap-2 text-[10px] font-bold text-gray-400 mb-1">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
                                                            <span className={theme.text}>{theme.label}</span>
                                                            <span className="mx-1 opacity-20">|</span>
                                                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <h4 className="font-bold text-gray-900 truncate uppercase tracking-tighter italic">{order.items.map(i => i.name).join(' | ')}</h4>
                                                        <p className="font-bold text-black text-lg">{formatPrice(order.totalAmount)}</p>
                                                    </div>
                                                    <ChevronRight className="text-gray-200 hidden md:block" />
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Task 2: Customer Care UI - Cleaned & Smaller Fonts */}
                        {activeSection === 'Customer Care' && (
                            <div className="max-w-2xl animate-fade-in space-y-8">
                                <div className="space-y-1">
                                    <h2 className="text-xl font-bold text-gray-900">Support Center</h2>
                                    <p className="text-sm text-gray-400">Our team is here to assist with any botanical or technical queries.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                                        <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600"><Mail size={18} /></div>
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Email Support</p>
                                            <p className="text-sm font-medium text-gray-800">info@naturelover.com</p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600"><Phone size={18} /></div>
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Call Center</p>
                                            <p className="text-sm font-medium text-gray-800">+91 9110750796</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Task 3: FAQ UI - Category Pills & Accordion as per SS-2 */}
                        {activeSection === 'FAQs' && (
                            <div className="animate-fade-in">
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-12">
                                    {['General', 'Pricing', 'Dashboard', 'Support'].map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setFaqCategory(cat)}
                                            className={`px-8 py-3 rounded-full text-xs font-bold border transition-all ${
                                                faqCategory === cat 
                                                ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-xl translate-y-[-2px]' 
                                                : 'bg-white border-gray-200 text-gray-400 hover:border-gray-900 hover:text-gray-900'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-0 divide-y divide-gray-100 max-w-4xl mx-auto md:mx-0 border border-gray-100 rounded-2xl overflow-hidden">
                                    {(faqs[faqCategory] || faqs.General).map((faq, i) => (
                                        <div key={i} className="bg-white overflow-hidden group">
                                            <button 
                                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                                className="w-full flex items-center justify-between p-6 hover:bg-gray-50/50 transition-colors"
                                            >
                                                <div className="flex items-center gap-6">
                                                    <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all">
                                                        {faq.icon ? <faq.icon size={18} /> : <HelpCircle size={18} />}
                                                    </div>
                                                    <span className="text-[15px] font-bold text-gray-900 text-left">{faq.q}</span>
                                                </div>
                                                {openFaq === i ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                            </button>
                                            {openFaq === i && (
                                                <div className="px-24 pb-8 animate-slide-down">
                                                    <p className="text-xs font-medium text-gray-400 leading-relaxed uppercase tracking-widest">
                                                        {faq.a}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AccountPage;
