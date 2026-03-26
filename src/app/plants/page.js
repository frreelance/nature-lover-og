"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Star, ShoppingCart, Sun, Droplets, Leaf, Sparkles } from 'lucide-react';
import ScrollToTop from '@/utils/ScrollToTop';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Toast from '@/components/Toast';
import { PLANTS } from '@/api/plantsData';

const Plants = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedCare, setSelectedCare] = useState('all');
  const [selectedEnvironment, setSelectedEnvironment] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredPlants, setFilteredPlants] = useState(PLANTS);
  const [quantities, setQuantities] = useState({});
  const sectionRef = useRef(null);
  const filterButtonRef = useRef(null);
  const filterPanelRef = useRef(null);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  useEffect(() => {
    if (!showFilters) return;
    const onPointerDown = (e) => {
      const target = e.target;
      if (filterButtonRef.current?.contains(target)) return;
      if (filterPanelRef.current?.contains(target)) return;
      setShowFilters(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown, { passive: true });
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [showFilters]);

  const requireAuthOrOpenModal = (pendingItem, pendingType) => {
    if (isAuthenticated) return true;
    localStorage.setItem(
      'pendingAddToCart',
      JSON.stringify({ item: pendingItem, type: pendingType, ts: Date.now() })
    );
    router.push('/auth?mode=login');
    return false;
  };

  useEffect(() => {
    let filtered = PLANTS;
    if (searchTerm) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (selectedSize !== 'all') {
      filtered = filtered.filter(p => p.size === selectedSize);
    }
    if (selectedEnvironment !== 'all') {
      filtered = filtered.filter(p => p.category === selectedEnvironment || p.category === 'both');
    }
    if (selectedCare !== 'all') {
      filtered = filtered.filter(p => {
        const price = p.price;
        if (selectedCare === 'budget') return price <= 100;
        if (selectedCare === 'affordable') return price > 100 && price <= 250;
        if (selectedCare === 'premium') return price > 250 && price <= 500;
        if (selectedCare === 'luxury') return price > 500;
        return true;
      });
    }
    setFilteredPlants(filtered);
  }, [searchTerm, selectedSize, selectedCare, selectedEnvironment]);

  const handleOrderNow = async (plant) => {
    const quantity = quantities[plant.id] || 1;
    const plantWithQuantity = { ...plant, quantity };
    if (!requireAuthOrOpenModal(plantWithQuantity, 'plant')) return;
    const result = await addToCart(plantWithQuantity, 'plant');
    setToast({
      isVisible: true,
      message: result?.success ? 'Added to cart successfully!' : (result?.message || 'Failed to add to cart'),
      type: result?.success ? 'success' : 'error'
    });
    setQuantities(prev => ({ ...prev, [plant.id]: 1 }));
  };

  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <Header />
      
      <section className="relative h-[60vh] overflow-hidden pt-10">
        <div className="absolute inset-0 z-0 bg-green-900">
          <div 
            className="w-full h-full bg-cover bg-center opacity-40"
            style={{ backgroundImage: `url('/LandingPage/land_scaping.jpg')` }}
          />
        </div>
        <div className="relative z-20 h-full flex items-center justify-center text-center px-4">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Plants <span className="text-green-400">Collection</span>
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Beautiful plants for gifting or enhancing your garden. Discover our curated collection.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white border-b sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search plants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-2xl focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                ref={filterButtonRef}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-all font-semibold"
              >
                <Filter className="h-5 w-5" /> Filters
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlants.map((plant) => (
              <div key={plant.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img src={plant.image_url} alt={plant.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">{plant.size}</span>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-green-800 mb-2 truncate">{plant.name}</h3>
                  <p className="text-gray-600 text-xs mb-4 h-8 overflow-hidden">{plant.description}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {plant.details.map((d, i) => (
                      <span key={i} className="text-[10px] bg-gray-50 text-gray-600 px-2 py-1 rounded-full">{d}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-green-600">₹{plant.price}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{plant.category}</span>
                  </div>
                  <button onClick={() => handleOrderNow(plant)} className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                    <ShoppingCart className="h-4 w-4" /> Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
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

export default Plants;
