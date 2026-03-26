"use client";
import React, { useEffect, useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Hero = () => {
  const heroRef = useRef(null);
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

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-green-950">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover">
          <source src="/LandingPage/animated_bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60"></div>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 text-center">
        <div ref={heroRef} className="opacity-0 translate-y-8 transition-all duration-1000">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Bring Nature to Your <span className="text-green-400">Home</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Premium plants and expert gardening services to help you create your own personal oasis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push('/services')}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold flex items-center gap-2 transition-all transform hover:scale-105"
            >
              Our Services <ArrowRight size={20}/>
            </button>
            <button 
              onClick={() => router.push('/plants')}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-full font-bold flex items-center gap-2 transition-all transform hover:scale-105 backdrop-blur-sm"
            >
              Buy Plants <ArrowRight size={20}/>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
