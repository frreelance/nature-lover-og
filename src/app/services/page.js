"use client";
import React, { useEffect, useState } from 'react';
import { ShoppingCart, Search, Check } from 'lucide-react';
import ScrollToTop from '@/utils/ScrollToTop';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Toast from '@/components/Toast';
import api from '@/api/api';

const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data } = await api.get('/api/products?type=service');
      setServices(data.data);
      setFilteredServices(data.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = services;
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }
    setFilteredServices(filtered);
  }, [searchTerm, selectedCategory, services]);

  const requireAuthOrOpenModal = (pendingItem, pendingType) => {
    if (isAuthenticated) return true;
    localStorage.setItem(
      'pendingAddToCart',
      JSON.stringify({ item: pendingItem, type: pendingType, ts: Date.now() })
    );
    router.push('/auth?mode=login');
    return false;
  };

  const handleOrderNow = async (service) => {
    const quantity = quantities[service._id] || 1;
    const serviceWithQuantity = { 
        id: service._id, 
        name: service.name, 
        price: service.price, 
        image: service.images[0], 
        category: service.category,
        duration: service.duration,
        quantity 
    };
    if (!requireAuthOrOpenModal(serviceWithQuantity, 'service')) return;
    const result = await addToCart(serviceWithQuantity, 'service');
    setToast({
      isVisible: true,
      message: result?.success ? 'Added to cart successfully!' : (result?.message || 'Failed to add to cart'),
      type: result?.success ? 'success' : 'error'
    });
    setQuantities(prev => ({ ...prev, [service._id]: 1 }));
  };

  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <Header />
      
      <section className="relative h-[40vh] overflow-hidden pt-10">
        <div className="absolute inset-0 z-0 bg-green-900">
          <div 
            className="w-full h-full bg-cover bg-center opacity-40"
            style={{ backgroundImage: `url('/LandingPage/land_scaping.jpg')` }}
          />
        </div>
        <div className="relative z-20 h-full flex items-center justify-center text-center px-4">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-black mb-6 text-white">
              Green <span className="text-green-400">Services</span>
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto font-medium">
              Expert gardening and maintenance solutions for your home and office.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white border-b sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1,2,3].map(i => (
                    <div key={i} className="aspect-video bg-gray-100 rounded-[2rem] animate-pulse" />
                ))}
             </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredServices.map((service) => (
                <div key={service._id} className="group bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all border border-gray-100 overflow-hidden transform hover:-translate-y-2">
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-50">
                    <img src={service.images[0]} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <span className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-green-700 shadow-sm">{service.duration || 'Flexible'}</span>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 truncate">{service.name}</h3>
                    <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">{service.description}</p>
                    
                    <div className="space-y-3 mb-8">
                        {service.serviceDetails?.slice(0, 3).map((detail, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                <div className="p-1 bg-green-100 text-green-600 rounded-full"><Check size={12} /></div>
                                {detail}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Starting from</p>
                        <span className="text-3xl font-black text-green-600">₹{service.price}</span>
                      </div>
                      <div className="text-right">
                         <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Category</span>
                         <span className="text-sm font-bold text-gray-800">{service.category}</span>
                      </div>
                    </div>
                    
                    <button 
                        onClick={() => handleOrderNow(service)} 
                        className="w-full bg-gray-900 hover:bg-green-600 text-white py-5 rounded-2xl font-black transition-all flex items-center justify-center gap-2 transform active:scale-95 shadow-xl shadow-gray-200"
                    >
                      <ShoppingCart className="h-5 w-5" /> Book Service
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredServices.length === 0 && (
            <div className="text-center py-20">
                <p className="text-2xl font-bold text-gray-300">No services found.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ isVisible: false, message: '', type: 'success' })}
      />
    </div>
  );
};

export default Services;
