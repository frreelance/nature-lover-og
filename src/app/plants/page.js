"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, ShoppingCart, SlidersHorizontal, X } from 'lucide-react';
import ScrollToTop from '@/utils/ScrollToTop';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/api/api';

const PlantsPage = () => {
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Filter States
  const [filters, setFilters] = useState({
    environment: 'all',
    size: 'all',
    priceRange: [0, 5000],
    sort: 'newest'
  });

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const { data } = await api.get('/api/products?type=plant');
      setPlants(data.data);
      setFilteredPlants(data.data);
    } catch (error) {
      toast.error('Failed to load plants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...plants];

    if (filters.environment !== 'all') {
      result = result.filter(p => p.category?.toLowerCase().includes(filters.environment.toLowerCase()));
    }

    if (filters.size !== 'all') {
      result = result.filter(p => {
        if (!p.size) return false;
        return p.size.toLowerCase() === filters.size.toLowerCase();
      });
    }

    result = result.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

    if (filters.sort === 'price-low') result.sort((a, b) => a.price - b.price);
    if (filters.sort === 'price-high') result.sort((a, b) => b.price - a.price);

    setFilteredPlants(result);
  }, [filters, plants]);

  const handleAddToBag = async (plant) => {
    const plantWithQuantity = { 
        id: plant._id, 
        name: plant.name, 
        price: plant.price, 
        image: plant.images[0], 
        category: plant.category,
        size: plant.size,
        quantity: 1
    };
    
    if (!isAuthenticated) {
      localStorage.setItem('pendingAddToCart', JSON.stringify({ item: plantWithQuantity, type: 'plant', ts: Date.now() }));
      router.push('/auth?mode=login');
      toast('Login to add to bag', { icon: '🔑' });
      return;
    }
    
    const loadingToast = toast.loading('Adding...');
    try {
        const res = await addToCart(plantWithQuantity, 'plant');
        if (res?.success) toast.success(`${plant.name} added!`, { id: loadingToast });
        else toast.error('Failed', { id: loadingToast });
    } catch (err) {
        toast.error('Error', { id: loadingToast });
    }
  };

  const FilterSection = () => (
    <div className="space-y-8">
      {/* Environment */}
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-gray-300">Environment</h4>
        <div className="space-y-2">
          {['all', 'Indoor', 'Outdoor'].map((type) => (
            <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
              <input 
                type="radio" 
                name="environment"
                checked={filters.environment === type}
                onChange={() => setFilters(prev => ({ ...prev, environment: type }))}
                className="w-3.5 h-3.5 accent-black" 
              />
              <span className={`text-xs font-bold ${filters.environment === type ? 'text-black' : 'text-gray-400 group-hover:text-black'} transition-colors capitalize`}>
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-gray-300">Pot Size</h4>
        <div className="space-y-2">
          {['all', 'Small', 'Moderate', 'Large'].map((size) => (
            <label key={size} className="flex items-center gap-2.5 cursor-pointer group">
              <input 
                type="radio" 
                name="size"
                checked={filters.size === size}
                onChange={() => setFilters(prev => ({ ...prev, size: size }))}
                className="w-3.5 h-3.5 accent-black" 
              />
              <span className={`text-xs font-bold ${filters.size === size ? 'text-black' : 'text-gray-400 group-hover:text-black'} transition-colors capitalize`}>
                {size}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-gray-300">Price Range</h4>
        <div className="space-y-2">
            <input 
                type="range" 
                min="0" 
                max="5000" 
                step="100"
                value={filters.priceRange[1]}
                onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [0, parseInt(e.target.value)] }))}
                className="w-full accent-black h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer"
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
          <aside className="hidden lg:block w-56 flex-shrink-0 animate-fade-in pr-6 border-r border-gray-50">
            <h2 className="text-xl font-black uppercase tracking-tighter mb-8">Filters</h2>
            <FilterSection />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-10 pb-4 border-b border-gray-50">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden flex items-center gap-2 px-3 py-1.5 border border-gray-100 rounded-lg text-[10px] font-bold uppercase tracking-widest"
                    >
                        <SlidersHorizontal size={12} /> Filter
                    </button>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-200">
                        {filteredPlants.length} Botanicals Found
                    </span>
                </div>
                
                <div className="flex items-center gap-3">
                    <select 
                        value={filters.sort}
                        onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                        className="text-[10px] font-bold uppercase tracking-widest outline-none bg-transparent cursor-pointer text-gray-400 hover:text-black transition-colors"
                    >
                        <option value="newest">Sort By: Recommended</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                    </select>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="space-y-3 animate-pulse">
                            <div className="aspect-square bg-gray-50 rounded-3xl" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                    {filteredPlants.map((plant) => (
                        <div key={plant._id} className="group animate-fade-in flex flex-col">
                            {/* Product Image */}
                            <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-gray-50 mb-6 flex items-center justify-center border border-gray-50 shadow-sm group-hover:shadow-lg transition-all duration-500">
                                <img src={plant.images[0]} alt={plant.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                <div className="absolute top-4 left-4">
                                     <span className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest text-gray-400 border border-gray-100 uppercase">Premium</span>
                                </div>
                            </div>
                            
                            {/* Product Details */}
                            <div className="flex-1 flex flex-col pl-1">
                                <div className="space-y-1.5 mb-6">
                                    <div className="flex items-center gap-2">
                                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{plant.category}</p>
                                        <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                        <p className="text-[9px] font-black text-green-600 uppercase tracking-widest">{plant.size || 'Regular'} size</p>
                                    </div>
                                    <h3 className="text-base font-bold text-gray-900 group-hover:text-green-800 transition-colors uppercase italic tracking-tighter truncate">{plant.name}</h3>
                                    <p className="text-2xl font-black tracking-tighter text-gray-900">₹{plant.price}</p>
                                </div>

                                <button 
                                    onClick={() => handleAddToBag(plant)}
                                    className="w-full bg-black text-white hover:bg-gray-800 py-3.5 rounded-2xl font-black transition-all flex items-center justify-center gap-2 transform active:scale-95 text-[9px] uppercase tracking-widest shadow-xl shadow-gray-100 group-hover:shadow-green-100 group-hover:-translate-y-1"
                                >
                                    <ShoppingCart size={14} strokeWidth={2.5} /> Add to Bag
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && filteredPlants.length === 0 && (
                <div className="text-center py-32">
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">No botanicals match these filters.</p>
                </div>
            ) }
          </main>
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      {isSidebarOpen && (
          <div className="fixed inset-0 z-[60] flex animate-fade-in">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
              <div className="relative w-72 bg-white h-full p-8 shadow-2xl flex flex-col animate-slide-left">
                  <div className="flex items-center justify-between mb-8 pb-3 border-b">
                      <h2 className="text-lg font-black uppercase">Refine Selection</h2>
                      <button onClick={() => setIsSidebarOpen(false)}><X size={18}/></button>
                  </div>
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                      <FilterSection />
                  </div>
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] mt-6 shadow-xl active:scale-95"
                  >
                    View Boutique
                  </button>
              </div>
          </div>
      )}

      <Footer />
    </div>
  );
};

export default PlantsPage;
