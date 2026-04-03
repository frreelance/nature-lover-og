"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, X, Gift, Send, Sparkles, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

import { usePathname } from "next/navigation";

const FloatingPromoCard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Show after 2.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText("FIRST100");
    setCopied(true);
    toast.success("Coupon code FIRST100 copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Do not show on admin pages
  if (!isVisible || pathname?.startsWith('/admin')) return null;

  return (
    <AnimatePresence mode="wait">
      {isMinimized ? (
        <motion.button
          key="minimized"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMinimized(false)}
          className="fixed bottom-8 right-8 z-[9999] w-14 h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-full shadow-lg shadow-green-500/30 flex items-center justify-center text-white border-4 border-white overflow-hidden group"
        >
           <motion.div
             animate={{ rotate: [0, 10, -10, 0] }}
             transition={{ repeat: Infinity, duration: 2 }}
           >
             <Gift size={24} />
           </motion.div>
           <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </motion.button>
      ) : (
        <motion.div
          key="full-card"
          initial={{ y: 100, opacity: 0, scale: 0.9, x: 20 }}
          animate={{ y: 0, opacity: 1, scale: 1, x: 0 }}
          exit={{ y: 100, opacity: 0, scale: 0.9 }}
          className="fixed bottom-8 right-8 z-[9999] w-[340px] overflow-hidden bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(22,163,74,0.15)] border border-green-100 ring-8 ring-green-500/5 select-none"
        >
          {/* Background Decorative Circles */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-50 rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-green-50 rounded-full blur-3xl opacity-50" />

          <div className="relative p-7 pb-6">
            <button
              onClick={() => setIsMinimized(true)}
              className="absolute top-5 right-5 p-2 hover:bg-gray-100 rounded-2xl transition-all text-gray-300 hover:text-gray-500 bg-white shadow-sm border border-gray-50"
            >
              <X size={14} />
            </button>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-xl shadow-green-500/20 rotate-3">
                  <Gift className="text-white" size={28} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100/50">Exclusive Offer</span>
                    <motion.div
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Sparkles size={12} className="text-amber-400" />
                    </motion.div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">
                    Your first service is <span className="text-green-600">Completely FREE!</span>
                  </h3>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50/50 rounded-[2rem] p-5 border border-gray-100/50 backdrop-blur-sm">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 text-center">Tap to copy coupon code</p>
                  <button 
                    onClick={copyCode}
                    className="w-full flex items-center justify-between bg-white border-2 border-dashed border-green-200 p-4 rounded-2xl cursor-pointer hover:border-green-500 hover:bg-green-50/30 transition-all group relative overflow-hidden active:scale-[0.98]"
                  >
                    <span className="font-mono text-2xl font-black tracking-[0.15em] text-green-700 ml-2">FIRST100</span>
                    <div className={`p-2.5 rounded-xl transition-all ${copied ? 'bg-green-600 rotate-0' : 'bg-green-100 -rotate-3 group-hover:rotate-0'}`}>
                      {copied ? <Check size={18} className="text-white" /> : <Copy size={18} className="text-green-600" />}
                    </div>
                  </button>
                </div>

                <div className="space-y-3 px-1">
                  <p className="text-[12px] text-gray-500 font-medium leading-relaxed">
                    Apply <span className="font-bold text-gray-800">FIRST100</span> at checkout to claim your first professional garden service for free.
                  </p>
                  <div className="flex items-start gap-2 bg-amber-50/50 p-3 rounded-2xl border border-amber-100/50">
                    <div className="mt-0.5 text-amber-500 shrink-0">
                      <Sparkles size={12} />
                    </div>
                    <p className="text-[10px] text-amber-700/70 font-bold leading-snug">
                      *First service is free. Subsequent service pricing will be discussed after the initial visit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={copyCode}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 py-5 text-center cursor-pointer hover:from-green-700 hover:to-green-800 transition-all relative group overflow-hidden"
          >
             <motion.div
               className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
             />
             <p className="text-white text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 relative z-10">
               Claim Free Session <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
             </p>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingPromoCard;
