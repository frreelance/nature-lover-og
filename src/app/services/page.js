"use client";
import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, Star, X, SlidersHorizontal, Wrench, Check } from 'lucide-react';
import ScrollToTop from '@/utils/ScrollToTop';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/api/api';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Filter States
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 10000],
    sort: 'popular',
    page: 1
  });
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchServices();
  }, [filters.category, filters.priceRange, filters.page, filters.sort]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/products', {
          params: {
              type: 'service',
              category: filters.category !== 'all' ? filters.category : undefined,
              maxPrice: filters.priceRange[1],
              page: filters.page,
              limit: 9
          }
      });
      
      let result = data.data;
      if (filters.sort === 'price-low') result.sort((a, b) => a.price - b.price);
      if (filters.sort === 'price-high') result.sort((a, b) => b.price - a.price);
      
      setFilteredServices(result);
      setPagination(data.pagination);
    } catch (error) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToBag = async (service) => {
    const serviceWithQuantity = { 
        id: service._id, 
        name: service.name, 
        price: service.price, 
        image: service.images[0], 
        category: service.category,
        duration: service.duration,
        quantity: 1
    };
    
    if (!isAuthenticated) {
      localStorage.setItem('pendingAddToCart', JSON.stringify({ item: serviceWithQuantity, type: 'service', ts: Date.now() }));
      router.push('/auth?mode=login');
      toast('Login to book service', { icon: '🔑' });
      return;
    }
    
    const loadingToast = toast.loading('Booking...');
    try {
        const res = await addToCart(serviceWithQuantity, 'service');
        if (res?.success) toast.success(`${service.name} booked!`, { id: loadingToast });
        else toast.error('Failed', { id: loadingToast });
    } catch (err) {
        toast.error('Error', { id: loadingToast });
    }
  };

  const categories = [
    { name: 'All Services', value: 'all' },
    { name: '🌳 Park & Lawn Service', value: 'Park and Lawn' },
    { name: '🏡 Home, Balcony & Pot', value: 'Home / Balcony' }
  ];

  const FilterSection = () => (
    <div className="space-y-10">
      {/* Category Filter */}
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-gray-300">Category</h4>
        <div className="space-y-2.5">
          {categories.map((cat) => (
            <label key={cat.value} className="flex items-start gap-3 cursor-pointer group">
              <input 
                type="radio" 
                name="category"
                checked={filters.category === cat.value}
                onChange={() => setFilters(prev => ({ ...prev, category: cat.value, page: 1 }))}
                className="w-3.5 h-3.5 mt-0.5 accent-blue-600 border-gray-100" 
              />
              <span className={`text-xs font-bold leading-tight ${filters.category === cat.value ? 'text-blue-600' : 'text-gray-400 group-hover:text-black'} transition-colors`}>
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-gray-300">Budget Range</h4>
        <div className="space-y-2">
            <input 
                type="range" 
                min="0" 
                max="10000" 
                step="500"
                value={filters.priceRange[1]}
                onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [0, parseInt(e.target.value)], page: 1 }))}
                className="w-full h-1 accent-blue-600 bg-gray-50 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                <span>₹0</span>
                <span>Max: ₹{filters.priceRange[1]}</span>
            </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-inter">
      <ScrollToTop />
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 pt-32">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0 animate-fade-in pr-6 border-r border-gray-50">
            <h2 className="text-xl font-black uppercase tracking-tighter mb-8">Service Plan</h2>
            <FilterSection />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden flex items-center gap-2 px-3 py-1.5 border border-gray-100 rounded-lg text-[10px] font-bold uppercase tracking-widest"
                    >
                        <SlidersHorizontal size={12} /> Filter
                    </button>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-200">
                        {filteredServices.length} Service Packs
                    </span>
                </div>
                
                <div className="flex items-center gap-3">
                    <select 
                        value={filters.sort}
                        onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                        className="text-[10px] font-bold uppercase tracking-widest outline-none bg-transparent cursor-pointer text-gray-400 hover:text-black transition-colors"
                    >
                        <option value="popular">Sorted by: Popular</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                    </select>
                </div>
            </div>

            {/* Grid (Compact for Services) */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1,2,3].map(i => (
                        <div key={i} className="space-y-4 animate-pulse">
                            <div className="aspect-[16/10] bg-gray-50 rounded-[2rem]" />
                            <div className="h-4 w-2/3 bg-gray-50 rounded" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {filteredServices.map((service) => (
                        <div key={service._id} className="group animate-fade-in flex flex-col">
                            <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden bg-gray-50 mb-5 border border-gray-50 shadow-sm group-hover:shadow-md transition-all duration-500">
                                <img src={service.images[0]} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                {service.duration && (
                                     <div className="absolute top-4 left-4">
                                         <span className="bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest text-blue-900 border border-blue-100 shadow-sm">{service.duration} Session</span>
                                     </div>
                                )}
                            </div>
                            
                            <div className="flex flex-col flex-1 pl-2">
                                <div className="flex justify-between items-start mb-2">
                                     <div className="space-y-1">
                                         <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{service.category}</p>
                                         <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-900 transition-colors uppercase italic tracking-tighter">{service.name}</h3>
                                     </div>
                                </div>
                                
                                <div className="space-y-1 mb-6">
                                    {service.serviceDetails?.slice(0, 2).map((detail, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                                            <Check size={8} className="text-blue-600" /> {detail}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between mt-auto">
                                    <p className="text-2xl font-black tracking-tighter text-gray-900">₹{service.price}.00</p>
                                    <button 
                                        onClick={() => handleAddToBag(service)}
                                        className="bg-blue-50 text-blue-700 px-6 py-2.5 rounded-xl font-black hover:bg-black hover:text-white transition-all transform active:scale-95 text-[10px] uppercase tracking-widest shadow-sm hover:shadow-lg"
                                    >
                                        Add to Bag
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && filteredServices.length > 0 && pagination.pages > 1 && (
                <div className="mt-16 flex justify-center items-center gap-4 animate-fade-in">
                    <button 
                        disabled={filters.page === 1}
                        onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                        className="px-6 py-3 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all disabled:opacity-20 flex items-center gap-2"
                    >
                        Prev
                    </button>
                    <div className="flex gap-2">
                        {Array.from({ length: pagination.pages }).map((_, i) => (
                            <button 
                                key={i}
                                onClick={() => setFilters(prev => ({ ...prev, page: i + 1 }))}
                                className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${filters.page === i + 1 ? 'bg-black text-white shadow-xl shadow-blue-100 scale-110' : 'text-gray-400 hover:bg-gray-50'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <button 
                        disabled={filters.page === pagination.pages}
                        onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                        className="px-6 py-3 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all disabled:opacity-20 flex items-center gap-2"
                    >
                        Next
                    </button>
                </div>
            )}

            {!loading && filteredServices.length === 0 && (
                <div className="text-center py-32">
                    <Wrench className="h-10 w-10 text-gray-100 mx-auto mb-4" />
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">No service packages found.</p>
                </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      {isSidebarOpen && (
          <div className="fixed inset-0 z-[60] flex animate-fade-in">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
              <div className="relative w-72 bg-white h-full p-8 shadow-2xl flex flex-col animate-slide-left">
                  <div className="flex items-center justify-between mb-8 pb-3 border-b">
                      <h2 className="text-lg font-black uppercase">Plan Details</h2>
                      <button onClick={() => setIsSidebarOpen(false)}><X size={18}/></button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                      <FilterSection />
                  </div>
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] mt-6 shadow-xl active:scale-95"
                  >
                    View Packages
                  </button>
              </div>
          </div>
      )}

      <Footer />
    </div>
  );
};

export default ServicesPage;
