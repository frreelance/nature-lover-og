"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 min-h-screen w-full flex flex-col items-center justify-center bg-[#0a0a0a] overflow-hidden text-center p-6 select-none">
      {/* Background Texture/Gradient */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ 
             backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)',
             backgroundSize: '100px 100px',
             backgroundPosition: '0 0, 50px 50px'
           }}>
      </div>
      <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-black opacity-60 pointer-events-none"></div>

      <div className="relative z-10 space-y-12 animate-fade-in-up">
        {/* Large 404 Blocks */}
        <div className="flex items-center justify-center gap-4 sm:gap-8">
          {['4', '0', '4'].map((num, i) => (
            <div 
              key={i} 
              className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-[2rem] flex items-center justify-center text-black text-5xl sm:text-7xl font-black shadow-2xl animate-float"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Text Section */}
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-7xl font-bold text-white tracking-tight">Page Not Found</h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            The page you are looking for was removed, moved, renamed,<br className="hidden sm:block" /> or might never existed.
          </p>
        </div>

        {/* Buttons Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button 
            onClick={() => router.back()}
            className="w-full sm:w-auto px-10 py-4 bg-transparent text-white border-2 border-white/20 rounded-xl font-bold text-sm hover:bg-white/10 transition-all active:scale-95"
          >
            Go Back
          </button>
          
          <Link 
            href="/"
            className="w-full sm:w-auto px-10 py-4 bg-white text-black rounded-xl font-bold text-sm shadow-xl hover:bg-gray-200 transition-all active:scale-95 text-center"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
