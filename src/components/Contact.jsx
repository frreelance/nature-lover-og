"use client";
import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle2, Send, ArrowRight } from 'lucide-react';

const Contact = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Construct mailto link for direct client-side mailing
    const subject = encodeURIComponent(`New Inquiry from ${formState.name}`);
    const body = encodeURIComponent(`Name: ${formState.name}\nEmail: ${formState.email}\n\nMessage:\n${formState.message}`);
    window.location.href = `mailto:naturelovers636@gmail.com?subject=${subject}&body=${body}`;
  };

  const benefits = [
    "Expert botanical care and plant health optimization",
    "Professional landscaping consultation for your space",
    "Premium quality plants sourced directly from our nursery",
    "On-time delivery and professional installation services"
  ];

  return (
    <section id="contact" className="py-16 bg-white relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4 mb-20">
          <p className="text-[10px] font-black text-green-600 uppercase tracking-[0.4em] mb-4">Contact Us</p>
          <h2 className="text-4xl md:text-6xl font-bold text-green-800 tracking-tighter leading-none mb-6">
            Get in touch <span className="italic">with us</span>
          </h2>
          <p className="text-sm font-medium text-gray-500 max-w-lg mx-auto leading-relaxed">
            Fill out the form below or reach out to us directly for professional gardening consultation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Left: Contact Form */}
          <div className="space-y-12">
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Name</label>
                <input 
                  type="text" 
                  name="name"
                  placeholder="Your name"
                  required
                  value={formState.name}
                  onChange={handleChange}
                  className="w-full bg-[#F9FBF9] border border-green-50 rounded-2xl p-5 text-sm font-bold placeholder:text-gray-300 focus:ring-1 focus:ring-green-600 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Email</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="Enter Your Email"
                  required
                  value={formState.email}
                  onChange={handleChange}
                  className="w-full bg-[#F9FBF9] border border-green-50 rounded-2xl p-5 text-sm font-bold placeholder:text-gray-300 focus:ring-1 focus:ring-green-600 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Message</label>
                <textarea 
                  name="message"
                  placeholder="Enter Your Message"
                  rows="4"
                  required
                  value={formState.message}
                  onChange={handleChange}
                  className="w-full bg-[#F9FBF9] border border-green-50 rounded-2xl p-5 text-sm font-bold placeholder:text-gray-300 focus:ring-1 focus:ring-green-600 outline-none transition-all resize-none"
                />
              </div>

              <div className="flex items-center gap-3 py-2">
                <input type="checkbox" required className="w-5 h-5 rounded-lg accent-green-600 cursor-pointer" id="terms" />
                <label htmlFor="terms" className="text-xs font-bold text-gray-400">
                  I agree with <span className="text-green-600 underline cursor-pointer">Terms and Conditions</span>
                </label>
              </div>

              <button type="submit" className="w-full bg-green-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-green-700 transition-all shadow-xl shadow-green-100 active:scale-95 flex items-center justify-center gap-3">
                Send Your Request
                <Send size={14} className="opacity-60" />
              </button>
            </form>
          </div>

          {/* Right: Info Section */}
          <div className="space-y-16">
            <div className="space-y-10">
               <h3 className="text-xl font-bold text-green-800 uppercase italic">With our services you can</h3>
               <ul className="space-y-6">
                 {benefits.map((benefit, idx) => (
                   <li key={idx} className="flex items-start gap-4 group">
                      <div className="w-6 h-6 rounded-full border border-green-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-600 group-hover:border-green-600 group-hover:text-white transition-all duration-500">
                        <CheckCircle2 size={14} className="text-green-600 group-hover:text-white" />
                      </div>
                      <span className="text-sm font-bold text-gray-500 leading-tight group-hover:text-green-800 transition-colors">
                        {benefit}
                      </span>
                   </li>
                 ))}
               </ul>
            </div>

            <div className="pt-10 border-t border-gray-100">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <MapPin size={18} className="text-green-800" />
                     <h4 className="text-sm font-black uppercase tracking-widest text-green-800">Visit Us</h4>
                  </div>
                  <p className="text-xs font-bold text-gray-400 leading-relaxed pl-7">
                    House No.1, 8th Floor<br/>
                    AARCITY D-Block<br/>
                    Sec.9-11, Hisar
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* Footer Contact Info */}
        <div className="mt-20 pt-10 border-t border-gray-100">
           <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-8 text-center">You can also Contact Us via</p>
           <div className="flex flex-wrap justify-center gap-12">
               <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all duration-300 shadow-sm shadow-green-100">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Us</p>
                    <p className="text-sm font-bold text-green-800">naturelovers636@gmail.com</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all duration-300 shadow-sm shadow-green-100">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Call Now</p>
                    <p className="text-sm font-bold text-green-800">+91 9509899906</p>
                  </div>
               </div>
           </div>
        </div>
      </div>

      {/* Background Decorative Element */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-green-50/30 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-40 left-0 w-64 h-64 bg-green-100/20 rounded-full blur-[80px] -z-10" />
    </section>
  );
};

export default Contact;
