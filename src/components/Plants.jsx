"use client";
import React, { useEffect, useRef } from 'react';
import { ArrowRight, Star, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Plants = () => {
  const sectionRef = useRef(null);
  const router = useRouter();

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

    return () => observer.disconnect();
  }, []);

  const allPlants = [
    {
      id: 1,
      name: "Money Plant",
      type: "Indoor",
      image: "/LandingPage/money_plant.jpg",
      description: "A resilient tropical climber that thrives in low light, bringing natural energy to your indoor space."
    },
    {
      id: 2,
      name: "Exotic Rose",
      type: "Outdoor",
      image: "/LandingPage/rose.jpg",
      description: "Premium fragrant blooms that transform your garden into a vintage botanical retreat."
    },
    {
      id: 3,
      name: "Snake Plant",
      type: "Indoor",
      image: "/LandingPage/indoor_plants.jpg",
      description: "The ultimate air-purifying companion with striking upright leaves and minimal water needs."
    },
    {
      id: 4,
      name: "Lush Fern",
      type: "Outdoor",
      image: "/LandingPage/indoor_plants.jpg",
      description: "Dense, feathery foliage that creates a cooling microclimate in your terrace or backyard."
    }
  ];

  const [category, setCategory] = React.useState('All');
  const filteredPlants = category === 'All' ? allPlants : allPlants.filter(p => p.type === category);

  return (
    <section id="products" className="py-6 bg-white font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div ref={sectionRef} className="opacity-0 transform translate-y-8 text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-green-800 mb-4 tracking-tight">
            Our Best <span className="text-green-600">Quality Products</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-center">
            Beautifully nurtured plants for your home and garden
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
             {['All', 'Indoor', 'Outdoor'].map((cat) => (
                <button
                   key={cat}
                   onClick={() => setCategory(cat)}
                   className={`px-8 py-2.5 rounded-full text-xs font-bold transition-all border ${
                       category === cat 
                       ? 'bg-green-600 border-green-600 text-white shadow-xl shadow-green-100' 
                       : 'bg-white border-green-100 text-green-800 hover:border-green-600 hover:text-green-600 shadow-sm'
                   }`}
                >
                   {cat}
                </button>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredPlants.slice(0, 3).map((plant, idx) => (
            <div key={idx} className="group flex flex-col items-center">
              <div className="relative w-full aspect-square rounded-[2.5rem] overflow-hidden group-hover:shadow-2xl transition-all duration-700">
                <img 
                    src={plant.image} 
                    alt={plant.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 shadow-lg" 
                />
                <button 
                  onClick={() => router.push('/plants')}
                  className="absolute bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-2xl scale-0 group-hover:scale-100 transition-all duration-500 hover:bg-green-600"
                >
                  <ArrowRight size={22} className="-rotate-45" />
                </button>
              </div>
              <div className="w-full text-center px-4 mt-8 space-y-3">
                <div>
                  <p className="text-[10px] font-black text-green-600 uppercase tracking-widest leading-none mb-2">{plant.type}</p>
                  <h3 className="text-xl font-bold text-green-800 tracking-tight leading-tight">{plant.name}</h3>
                </div>
                <div className="max-w-[280px] mx-auto">
                    <p className="text-sm font-medium text-gray-500 leading-relaxed italic">
                        "{plant.description}"
                    </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button 
            onClick={() => router.push('/plants')}
            className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-full font-bold flex items-center gap-3 mx-auto transition-all transform hover:scale-105 shadow-xl shadow-green-100"
          >
            Browse Plants <ArrowRight size={20}/>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Plants;
