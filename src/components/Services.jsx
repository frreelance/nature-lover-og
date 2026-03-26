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
      description: "Professional lawn mowing and maintenance",
      image: "/LandingPage/grass_cutting.jpg",
      color: "from-orange-400 to-orange-500"
    },
    {
      icon: TreePine,
      title: "Tree Work",
      description: "Tree pruning, removal, and health care",
      image: "/LandingPage/tree_work.jpg",
      color: "from-green-400 to-green-500"
    },
    {
      icon: Palette,
      title: "Landscaping",
      description: "Complete garden design and transformation",
      image: "/LandingPage/land_scaping.jpg",
      color: "from-blue-400 to-blue-500"
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div ref={sectionRef} className="opacity-0 transform translate-y-8 text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
            Our {' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800">
              Services
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional gardening services tailored to your needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className={`absolute top-4 right-4 w-12 h-12 bg-gradient-to-r ${service.color} rounded-full flex items-center justify-center shadow-lg`}>
                  <service.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-green-800 mb-3 group-hover:text-green-600 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                <button 
                  onClick={() => router.push('/services')}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-full font-semibold transition-all flex items-center justify-center space-x-2"
                >
                  <span>Learn More</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={() => router.push('/services')}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 mx-auto transition-all transform hover:scale-105"
          >
            View All Services <ArrowRight size={20}/>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;
