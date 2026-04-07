"use client";
import React, { useState } from 'react';
import { Leaf, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/utils/ScrollToTop';

const ResetPassword = () => {
  const { token } = useParams();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/user/reset-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage('Password reset successful! Redirecting you...');
        setTimeout(() => {
          router.push('/auth');
        }, 3000);
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
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-green-100">
            <div className="flex flex-col items-center mb-8">
              <div className="bg-green-500 p-4 rounded-2xl shadow-lg mb-4">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-green-800 text-center">Set New Password</h1>
              <p className="text-gray-500 text-center mt-2 text-sm px-4">
                Enter your new password below.
              </p>
            </div>

            {message && (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 border border-green-200 text-center flex items-center justify-center space-x-2">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">{message}</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 border border-red-200 text-center flex items-center justify-center space-x-2">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium text-sm">{error}</span>
              </div>
            )}

            {!message && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">New Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-green-500" />
                    <input
                      type="password"
                      placeholder="Minimum 6 characters"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl focus:border-green-500 focus:outline-none transition-all bg-gray-50/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Confirm New Password</label>
                  <div className="relative group/confirm">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within/confirm:text-green-500" />
                    <input
                      type="password"
                      placeholder="Repeat New Password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl focus:border-green-500 focus:outline-none transition-all bg-gray-50/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold shadow-xl shadow-green-200 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : 'Confirm New Password'}
                </button>
              </form>
            )}

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Remembered your password?{' '}
                <Link href="/auth" className="font-bold text-green-600 hover:text-green-700 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;
