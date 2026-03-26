"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Mail, Phone, MapPin, ArrowRight, Sparkles, Star, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import ScrollToTop from '@/utils/ScrollToTop';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import api from '@/api/api';

const Contact = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/api/contact/send-message', formData);
      if (response.data.success) {
        setMessage(response.data.message);
        setMessageType('success');
        setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
      }
    } catch (error) {
      setMessage('Failed to send message.');
      setMessageType('error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <Header />
      <section className="relative h-[60vh] bg-green-900 pt-10 flex items-center justify-center text-center text-white">
        <div className="animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Get In <span className="text-green-400">Touch</span></h1>
          <p className="max-w-2xl mx-auto">Ready to transform your garden? Contact us today.</p>
        </div>
      </section>
      <section className="py-20 max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-green-800">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <Mail className="text-green-600" /> <span>naturelovers636@gmail.com</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <Phone className="text-green-600" /> <span>+91 9509899906</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <MapPin className="text-green-600" /> <span>Hisar, Haryana</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="firstName" placeholder="First Name" required value={formData.firstName} onChange={handleChange} className="p-3 border rounded-xl" />
              <input type="text" name="lastName" placeholder="Last Name" required value={formData.lastName} onChange={handleChange} className="p-3 border rounded-xl" />
            </div>
            <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} className="w-full p-3 border rounded-xl" />
            <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full p-3 border rounded-xl" />
            <textarea name="message" rows="4" placeholder="Message" required value={formData.message} onChange={handleChange} className="w-full p-3 border rounded-xl" />
            <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold">
              {loading ? 'Sending...' : 'Send Message'}
            </button>
            {message && <p className={`text-center mt-4 ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;
