"use client";
import React, { useState } from 'react';
import { Leaf, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/utils/ScrollToTop';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/user/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage(data.message);
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col">
      <ScrollToTop />
      <Header />
      <div className="flex-grow py-32">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-green-100 transform transition-all hover:scale-[1.01]">
            <div className="flex flex-col items-center mb-8">
              <div className="bg-green-500 p-4 rounded-2xl shadow-lg mb-4">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-green-800 text-center">Forgot Password?</h1>
              <p className="text-gray-500 text-center mt-2 text-sm">
                No worries, we'll send you reset instructions.
              </p>
            </div>

            {message && (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 border border-green-200 text-sm font-medium animate-pulse">
                {message}
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 border border-red-200 text-sm font-medium">
                {error}
              </div>
            )}

            {!message && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transitions-colors group-focus-within:text-green-500" />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl focus:border-green-500 focus:outline-none transition-all bg-gray-50/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold shadow-xl shadow-green-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending link...
                    </span>
                  ) : 'Reset Password'}
                </button>
              </form>
            )}

            <div className="mt-8 text-center">
              <Link href="/auth" className="inline-flex items-center text-sm font-semibold text-green-600 hover:text-green-700 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
