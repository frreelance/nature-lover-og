"use client";
import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle2, Send, ArrowRight, Sparkles, Star, Zap } from 'lucide-react';
import ScrollToTop from '@/utils/ScrollToTop';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import api from '@/api/api';

const Contact = () => {
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    phone: '', 
    message: '' 
  });
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setResponseMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/api/contact/send-message', formData);
      if (response.data.success) {
        setResponseMsg(response.data.message);
        setMessageType('success');
        setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
      }
    } catch (error) {
      setResponseMsg('Failed to send message. Please try again.');
      setMessageType('error');
    }
    setLoading(false);
  };

  const benefits = [
    "Improve the aesthetic and health of your garden oasis",
    "Get personalized plant recommendations for your specific space",
    "Reduce maintenance time with our expert landscaping care",
    "Balance your home's ecosystem with organic greenery solutions"
  ];

  return (
    <div className="min-h-screen bg-[#FAFBFA] font-sans relative overflow-hidden">
      <ScrollToTop />
      <Header />
      
      {/* Decorative Atmospheric Blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-100/40 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50/30 rounded-full blur-[100px] -z-10" />

      {/* Centered Page Header Section */}
      <section className="pt-32 pb-12 animate-fade-in-up transition-all">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center space-y-4">
          <p className="text-[10px] font-black text-green-600 uppercase tracking-[0.4em] mb-4">Contact Us</p>
          <h1 className="text-3xl md:text-5xl font-bold text-green-800 tracking-tighter leading-none mb-4">
            Get in touch <span className="italic">with us</span>
          </h1>
          <p className="text-sm font-semibold text-gray-600 max-w-lg mx-auto leading-relaxed">
            Fill out the form below or reach out to us directly for professional botanical consultation.
          </p>
        </div>
      </section>

      {/* Main Content Grid with Elevated Cards */}
      <section className="py-12 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-green-900/5 p-8 md:p-16 border border-green-50/50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            
            {/* Left Side: Professional Form */}
            <div className="space-y-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest pl-2">First Name</label>
                    <input 
                      type="text" name="firstName" placeholder="First Name" required 
                      value={formData.firstName} onChange={handleChange} 
                      className="w-full bg-[#FAFAFA] border border-gray-100 rounded-2xl p-4 text-sm font-bold text-gray-700 placeholder:text-gray-300 focus:bg-white focus:ring-1 focus:ring-green-600 outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest pl-2">Last Name</label>
                    <input 
                      type="text" name="lastName" placeholder="Last Name" required 
                      value={formData.lastName} onChange={handleChange} 
                      className="w-full bg-[#FAFAFA] border border-gray-100 rounded-2xl p-4 text-sm font-bold text-gray-700 placeholder:text-gray-300 focus:bg-white focus:ring-1 focus:ring-green-600 outline-none transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest pl-2">Email</label>
                  <input 
                    type="email" name="email" placeholder="Enter Your Email" required 
                    value={formData.email} onChange={handleChange} 
                    className="w-full bg-[#FAFAFA] border border-gray-100 rounded-2xl p-4 text-sm font-bold text-gray-700 placeholder:text-gray-300 focus:bg-white focus:ring-1 focus:ring-green-600 outline-none transition-all" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest pl-2">Phone</label>
                  <input 
                    type="tel" name="phone" placeholder="Your Phone Number" 
                    value={formData.phone} onChange={handleChange} 
                    className="w-full bg-[#FAFAFA] border border-gray-100 rounded-2xl p-4 text-sm font-bold text-gray-700 placeholder:text-gray-300 focus:bg-white focus:ring-1 focus:ring-green-600 outline-none transition-all" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest pl-2">Message</label>
                  <textarea 
                    name="message" rows="4" placeholder="Enter Your Message" required 
                    value={formData.message} onChange={handleChange} 
                    className="w-full bg-[#FAFAFA] border border-gray-100 rounded-2xl p-4 text-sm font-bold text-gray-700 placeholder:text-gray-300 focus:bg-white focus:ring-1 focus:ring-green-600 outline-none transition-all resize-none" 
                  />
                </div>

                <button 
                  type="submit" disabled={loading}
                  className="w-full bg-green-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-green-700 transition-all shadow-xl shadow-green-100 active:scale-95 flex items-center justify-center gap-3"
                >
                  {loading ? 'Sending...' : 'Send Your Request'}
                  <Send size={14} className="opacity-60" />
                </button>
                
                {responseMsg && (
                  <p className={`text-center animate-fade-in font-bold text-xs uppercase tracking-widest mt-6 ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {responseMsg}
                  </p>
                )}
              </form>
            </div>

            {/* Right Side: Benefits & Info */}
            <div className="space-y-16">
              <div className="space-y-10">
                 <h3 className="text-xl font-bold text-green-800 uppercase italic">With our services you can</h3>
                 <ul className="space-y-8">
                   {benefits.map((benefit, idx) => (
                     <li key={idx} className="flex items-start gap-4 group">
                        <div className="w-8 h-8 rounded-full border border-green-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-600 group-hover:border-green-600 group-hover:text-white transition-all duration-500 shadow-sm">
                          <CheckCircle2 size={16} className="text-green-600 group-hover:text-white" />
                        </div>
                        <span className="text-sm font-bold text-gray-600 leading-tight group-hover:text-green-800 transition-colors">
                          {benefit}
                        </span>
                     </li>
                   ))}
                 </ul>
              </div>

              <div className="pt-10 border-t border-gray-100">
                 <div className="space-y-4">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-800">
                         <MapPin size={20} />
                       </div>
                       <h4 className="text-sm font-black uppercase tracking-widest text-green-800">Visit Us</h4>
                    </div>
                    <p className="text-xs font-bold text-gray-600 leading-relaxed pl-14">
                      House No.1, 8th Floor<br/>
                      AARCITY D-Block, Sec.9-11<br/>
                      Hisar, Haryana
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Contact Strip */}
        <div className="mt-16 pt-10 border-t border-gray-100">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-12 text-center">Reach us instantly</p>
           <div className="flex flex-wrap justify-center gap-10 md:gap-20">
               <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all duration-500 shadow-sm shadow-green-900/5">
                    <Mail size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Us</p>
                    <p className="text-sm font-bold text-green-800">naturelovers636@gmail.com</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all duration-500 shadow-sm shadow-green-900/5">
                    <Phone size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Call Now</p>
                    <p className="text-sm font-bold text-green-800">+91 9509899906</p>
                  </div>
               </div>
           </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
