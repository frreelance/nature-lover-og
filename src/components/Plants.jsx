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

  const plants = [
    {
      name: "Roses",
      price: "₹150",
      image: "/LandingPage/rose.jpg",
      rating: 4.8,
      reviews: 124,
      badge: "Best Seller"
    },
    {
      name: "Money Plant",
      price: "₹50",
      image: "/LandingPage/money_plant.jpg",
      rating: 4.9,
      reviews: 89,
      badge: "Popular"
    },
    {
      name: "Indoor Plants",
      price: "₹150",
      image: "/LandingPage/indoor_plants.jpg",
      rating: 4.7,
      reviews: 156,
      badge: "New"
    }
  ];

  return (
    <section id="plants" className="py-20 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div ref={sectionRef} className="opacity-0 transform translate-y-8 text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
            Plants <span className="text-green-600">Collection</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-center">
            Beautiful plants for gifting or enhancing your garden
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plants.map((plant, index) => (
            <div key={index} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-green-50">
              <div className="relative h-64 overflow-hidden">
                <img src={plant.image} alt={plant.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${plant.badge === 'Best Seller' ? 'bg-red-500' : plant.badge === 'Popular' ? 'bg-blue-500' : 'bg-green-500'}`}>
                    {plant.badge}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-green-800">{plant.name}</h3>
                <div className="flex items-center gap-1 my-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-bold">{plant.rating}</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-2xl font-bold text-green-600">{plant.price}</span>
                  <button onClick={() => router.push('/plants')} className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg transition-all transform hover:rotate-12">
                    <ShoppingCart size={20}/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={() => router.push('/plants')}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 mx-auto transition-all transform hover:scale-105"
          >
            Browse All Plants <ArrowRight size={20}/>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Plants;
