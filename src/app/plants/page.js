"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, ShoppingCart } from 'lucide-react';
import ScrollToTop from '@/utils/ScrollToTop';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Toast from '@/components/Toast';
import api from '@/api/api';

const Plants = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedCare, setSelectedCare] = useState('all');
  const [selectedEnvironment, setSelectedEnvironment] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const filterButtonRef = useRef(null);
  const filterPanelRef = useRef(null);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const { data } = await api.get('/api/products?type=plant');
      setPlants(data.data);
      setFilteredPlants(data.data);
    } catch (error) {
      console.error('Error fetching plants:', error);
    } finally {
      setLoading(false);
    }
  };

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
    let filtered = plants;
    if (searchTerm) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    // Size and other filters can be added here if needed in model
    setFilteredPlants(filtered);
  }, [searchTerm, plants]);

  const handleOrderNow = async (plant) => {
    const quantity = quantities[plant._id] || 1;
    const plantWithQuantity = { 
        id: plant._id, 
        name: plant.name, 
        price: plant.price, 
        image: plant.images[0], 
        category: plant.category,
        size: plant.size,
        quantity 
    };
    if (!requireAuthOrOpenModal(plantWithQuantity, 'plant')) return;
    const result = await addToCart(plantWithQuantity, 'plant');
    setToast({
      isVisible: true,
      message: result?.success ? 'Added to cart successfully!' : (result?.message || 'Failed to add to cart'),
      type: result?.success ? 'success' : 'error'
    });
    setQuantities(prev => ({ ...prev, [plant._id]: 1 }));
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
              Green <span className="text-green-400">Collection</span>
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto font-medium">
              Curated plants to bring life to your space.
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
                placeholder="Search plants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1,2,3,4].map(i => (
                    <div key={i} className="aspect-[4/5] bg-gray-100 rounded-[2rem] animate-pulse" />
                ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredPlants.map((plant) => (
                <div key={plant._id} className="group bg-white rounded-[2rem] shadow-sm hover:shadow-2xl transition-all border border-gray-100 overflow-hidden transform hover:-translate-y-2">
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <img src={plant.images[0]} alt={plant.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-green-700">{plant.category}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">{plant.name}</h3>
                    <p className="text-gray-500 text-xs mb-4 line-clamp-1">{plant.description}</p>
                    
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-2xl font-black text-green-600">₹{plant.price}</span>
                      <div className="flex gap-1">
                        {plant.care?.sunlight && <div title="Sunlight" className="p-1.5 bg-yellow-50 text-yellow-600 rounded-lg"><Search size={14} /></div>}
                        {plant.care?.watering && <div title="Watering" className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Search size={14} /></div>}
                      </div>
                    </div>
                    
                    <button 
                        onClick={() => handleOrderNow(plant)} 
                        className="w-full bg-gray-900 hover:bg-green-600 text-white py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 transform active:scale-95 shadow-xl shadow-gray-200"
                    >
                      <ShoppingCart className="h-5 w-5" /> Order Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredPlants.length === 0 && (
            <div className="text-center py-20">
                <p className="text-2xl font-bold text-gray-300">No plants found matching your search.</p>
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

export default Plants;
