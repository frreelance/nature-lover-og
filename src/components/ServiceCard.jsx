"use client";
import React, { useState } from 'react';
import { Check, ArrowRight, Star, Sparkles } from 'lucide-react';

const ServiceCard = ({ service, onOrderNow }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Popular': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200';
      case 'Expert': return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-purple-200';
      case 'New': return 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-200';
      case 'Best Value': return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-200';
      case 'Seasonal': return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-yellow-200';
      case 'Premium': return 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-200';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-gray-200';
    }
  };

  return (
    <div 
      className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden border border-gray-100 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating Elements */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute top-4 right-4 animate-float">
            <Sparkles className="h-4 w-4 text-yellow-400 opacity-60" />
          </div>
          <div className="absolute bottom-4 left-4 animate-float-delayed">
            <Star className="h-3 w-3 text-green-400 opacity-40" />
          </div>
        </div>
      )}

      {/* Service Image */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        
        {/* Badge */}
        <div className="absolute top-4 left-4 z-20">
          <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${getBadgeColor(service.badge)} transform group-hover:scale-105 transition-transform duration-300`}>
            {service.badge}
          </span>
        </div>

        {/* Price Overlay */}
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg">
            <div className="text-2xl font-bold text-green-600">{service.price}</div>
            <div className="text-xs text-gray-500">{service.period}</div>
          </div>
        </div>
      </div>

      {/* Service Content */}
      <div className="p-8">
        <h3 className="text-2xl font-bold text-green-800 mb-4 group-hover:text-green-600 transition-colors duration-300">
          {service.title}
        </h3>
        
        <p className="text-gray-600 mb-6 leading-relaxed text-base">
          {service.description}
        </p>

        {/* Features */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            What's Included:
          </h4>
          <ul className="space-y-3">
            {service.features.map((feature, idx) => (
              <li key={idx} className="flex items-center space-x-3 group/feature">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover/feature:bg-green-500 transition-colors duration-300">
                  <Check className="h-3 w-3 text-green-600 group-hover/feature:text-white transition-colors duration-300" />
                </div>
                <span className="text-sm text-gray-600 group-hover/feature:text-gray-800 transition-colors duration-300">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Order Button */}
        <button
          onClick={() => onOrderNow(service)}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-3 shadow-lg"
        >
          <span>Order Now</span>
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;

