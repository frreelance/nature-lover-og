"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Star, Zap, Check, Search, Filter, ShoppingCart } from 'lucide-react';
import ScrollToTop from '@/utils/ScrollToTop';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Toast from '@/components/Toast';

const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredServices, setFilteredServices] = useState([]);
  const [quantities, setQuantities] = useState({});
  const sectionRef = useRef(null);
  const heroRef = useRef(null);
  const filterButtonRef = useRef(null);
  const filterPanelRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const services = [
    {
      id: 1,
      title: "Grass Cutting",
      description: "Professional lawn mowing service for parks, societies, and large gardens.",
      image: "/LandingPage/grass_cutting.jpg",
      features: ["Professional mowing", "Edge trimming", "Grass collection"],
      badge: "Popular",
      category: "park-lawn"
    },
    {
      id: 2,
      title: "Lawn Care & Maintenance",
      description: "Complete lawn care including fertilization, weed control, and aeration.",
      image: "/LandingPage/grass_cutting.jpg",
      features: ["Fertilization", "Weed control", "Aeration"],
      badge: "Best Value",
      category: "park-lawn"
    },
    {
      id: 3,
      title: "Tree Pruning & Trimming",
      description: "Expert tree care services including pruning, trimming, and health assessments.",
      image: "/LandingPage/tree_work.jpg",
      features: ["Pruning", "Safety trimming", "Health check"],
      badge: "Expert",
      category: "park-lawn"
    },
    {
      id: 4,
      title: "Hedge Cutting & Shaping",
      description: "Professional hedge trimming and shaping services for neat boundaries.",
      image: "/LandingPage/land_scaping.jpg",
      features: ["Precision trimming", "Creative shaping", "Cleanup"],
      badge: "Popular",
      category: "park-lawn"
    },
    {
      id: 5,
      title: "Landscaping Design & Execution",
      description: "Complete landscape design to transform your outdoor space.",
      image: "/LandingPage/land_scaping.jpg",
      features: ["Custom design", "Installation", "Hardscape"],
      badge: "Premium",
      category: "park-lawn"
    },
    {
      id: 6,
      title: "Seasonal Outdoor Planting",
      description: "Professional seasonal planting services for vibrant, year-round beauty.",
      image: "/LandingPage/tree_work.jpg",
      features: ["Seasonal selection", "Soil prep", "Planting"],
      badge: "Seasonal",
      category: "park-lawn"
    },
    {
      id: 7,
      title: "Monthly Garden Maintenance",
      description: "Premium monthly maintenance package for parks and large gardens.",
      image: "/LandingPage/land_scaping.jpg",
      features: ["Regular cutting", "Pruning", "Fertilization"],
      badge: "Popular",
      category: "park-lawn"
    },
    {
      id: 8,
      title: "Indoor & Balcony Garden Setup",
      description: "Transform your balcony into a green paradise with our setup service.",
      image: "/LandingPage/grass_cutting.jpg",
      features: ["Space planning", "Plant selection", "Installation"],
      badge: "Popular",
      category: "home-balcony"
    },
    {
      id: 9,
      title: "Flower Pot Planting",
      description: "Professional pot planting service for your home or balcony.",
      image: "/LandingPage/tree_work.jpg",
      features: ["Selection advice", "Quality soil", "Planting"],
      badge: "Best Value",
      category: "home-balcony"
    },
    {
      id: 10,
      title: "Pot & Plant Maintenance",
      description: "Complete plant care service including repotting and fertilization.",
      image: "/LandingPage/grass_cutting.jpg",
      features: ["Repotting", "Fertilizer", "Pest control"],
      badge: "Comprehensive",
      category: "home-balcony"
    },
    {
      id: 11,
      title: "Repotting & Soil Replacement",
      description: "Expert repotting service with nutrient-rich soil.",
      image: "/LandingPage/land_scaping.jpg",
      features: ["Careful repotting", "Premium soil", "Root check"],
      badge: "Essential",
      category: "home-balcony"
    },
    {
      id: 12,
      title: "Plant Health Check",
      description: "Professional plant diagnosis and targeted treatment solutions.",
      image: "/LandingPage/tree_work.jpg",
      features: ["Diagnosis", "Pest treatment", "Care advice"],
      badge: "Expert",
      category: "home-balcony"
    },
    {
      id: 13,
      title: "Monthly Home Plant Care",
      description: "Premium monthly care package for your home plants.",
      image: "/LandingPage/land_scaping.jpg",
      features: ["Health checks", "Fertilization", "Pruning"],
      badge: "Popular",
      category: "home-balcony"
    }
  ];

  useEffect(() => {
    let filtered = services;
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }
    setFilteredServices(filtered);
  }, [searchTerm, selectedCategory]);

  const handleOrderNow = async (service) => {
    const quantity = quantities[service.id] || 1;
    const serviceWithQuantity = { ...service, quantity };
    if (!requireAuthOrOpenModal(serviceWithQuantity, 'service')) return;
    const result = await addToCart(serviceWithQuantity, 'service');
    setToast({
      isVisible: true,
      message: result?.success ? 'Added to cart successfully!' : (result?.message || 'Failed to add to cart'),
      type: result?.success ? 'success' : 'error'
    });
    setQuantities(prev => ({ ...prev, [service.id]: 1 }));
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
        </div>

        <div className="relative z-20 h-full flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
              Our Gardening <span className="text-green-400">Services</span>
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Professional gardening services to keep your outdoor space beautiful and healthy year-round.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 transition-all"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'park-lawn', 'home-balcony'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    selectedCategory === cat ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat === 'park-lawn' ? 'Park & Lawn' : 'Home & Balcony'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div key={service.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <span className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">{service.badge}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-green-800 mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{service.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {service.features.map((f, i) => (
                      <span key={i} className="flex items-center gap-1 text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-100">
                        <Check className="h-3 w-3" /> {f}
                      </span>
                    ))}
                  </div>
                  <button onClick={() => handleOrderNow(service)} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg">
                    <ShoppingCart className="h-5 w-5" /> Order Now
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

export default Services;
