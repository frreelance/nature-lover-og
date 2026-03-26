"use client";
import React, { useEffect, useRef } from 'react';
import { Sprout, Wrench, Heart } from 'lucide-react';

const WhyChooseUs = () => {
  const sectionRef = useRef(null);

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

  const features = [
    {
      icon: Sprout,
      title: "Local Soil & Plant Knowledge",
      description:
        "We understand local soil, weather, and seasonal plant needs for better growth.",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Wrench,
      title: "Hardworking & Reliable Service",
      description:
        "On-time service with proper tools and honest work you can trust.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Heart,
      title: "Care Like Our Own Garden",
      description:
        "We treat every plant with patience, care, and full responsibility.",
      color: "from-pink-500 to-pink-600",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Text Content */}
          <div ref={sectionRef} className="opacity-0 transform translate-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-6">
              Why Choose{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800">
                US?
              </span>
            </h2>

            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              We are local garden experts who understand soil, seasons, and plants
              of our area. From small village homes to farmhouses and parks, we
              take complete responsibility of your garden like our own.
            </p>

            <p className="text-sm text-green-700 mb-10 font-medium">
              Serving homes, villages, farmhouses & societies 🌿
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 group hover:scale-105 transition-all duration-300"
                >
                  <div
                    className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center group-hover:shadow-lg transition-all duration-300`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-green-800 mb-1 group-hover:text-green-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500">
              <img
                src="/LandingPage/tree_work.jpg"
                alt="Local gardeners working in village garden"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent"></div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-green-200 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-yellow-200 rounded-full opacity-40 animate-pulse delay-1000"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

