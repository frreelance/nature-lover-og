"use client";
import React, { useEffect, useRef } from 'react';
import { ArrowRight, Scissors, TreePine, Palette } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Services = () => {
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

  const services = [
    {
      icon: Scissors,
      title: "Grass Cutting",
      label: "Lawn Care",
      description: "Precision mowing and aeration to keep your lawns lush, vibrant, and perfectly level throughout the year.",
      image: "/LandingPage/grass_cutting.jpg",
    },
    {
      icon: TreePine,
      title: "Tree Management",
      label: "Health & Trim",
      description: "Expert pruning and structural support for your mature trees, ensuring safety and long-term vitality.",
      image: "/LandingPage/tree_work.jpg",
    },
    {
      icon: Palette,
      title: "Landscaping",
      label: "Design",
      description: "Transformative garden planning that blends seasonal colors with modern structural hardscaping.",
      image: "/LandingPage/land_scaping.jpg",
    }
  ];

  return (
    <section id="services" className="py-6 bg-white font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div ref={sectionRef} className="opacity-0 transform translate-y-8 text-center mb-20">
          <p className="text-[10px] font-black text-green-600 uppercase tracking-[0.4em] mb-4">Professional Care</p>
          <h2 className="text-3xl md:text-5xl font-bold text-green-800 tracking-tight">
            Our <span className="text-green-600">Expertise</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mt-4 font-medium italic">
            Nurturing your green spaces with artistic precision and organic wisdom
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {services.map((service, index) => (
            <div key={index} className="group flex flex-col items-center">
              {/* Image with Hover Button */}
              <div className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden group-hover:shadow-2xl transition-all duration-700">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 shadow-lg" 
                />
                
                {/* Floating Icon Badge */}
                <div className="absolute top-6 left-6 w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 text-white">
                  <service.icon size={20} />
                </div>

                {/* Hover Reveal Button */}
                <button 
                  onClick={() => router.push('/services')}
                  className="absolute bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-2xl scale-0 group-hover:scale-100 transition-all duration-500 hover:bg-green-600"
                >
                  <ArrowRight size={22} className="-rotate-45" />
                </button>
              </div>

              {/* Text Information Below */}
              <div className="w-full text-center px-4 mt-8 space-y-3">
                <div>
                  <p className="text-[10px] font-black text-green-600 uppercase tracking-widest leading-none mb-2">{service.label}</p>
                  <h3 className="text-xl font-bold text-green-800 tracking-tight leading-tight">{service.title}</h3>
                </div>
                <div className="max-w-[300px] mx-auto">
                    <p className="text-sm font-medium text-gray-400 leading-relaxed italic">
                        "{service.description}"
                    </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
                  <button 
                    onClick={() => router.push('/services')}
                    className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-full font-bold flex items-center gap-3 mx-auto transition-all transform hover:scale-105 shadow-xl shadow-green-100"
                  >
                    Browse Services <ArrowRight size={20}/>
                  </button>
                </div>
      </div>
    </section>
  );
};

export default Services;
