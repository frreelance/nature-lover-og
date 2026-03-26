"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Lock, Mail, AlertCircle, Leaf } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      router.replace('/admin/dashboard');
    }
  }, [user, isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.message || 'Login failed');
        setLoading(false);
      }
    } catch (err) {
      setError('An error occurred during login');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>
        {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 flex items-center gap-2"><AlertCircle size={18}/>{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
            <input type="email" placeholder="Admin Email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 border rounded-lg" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
            <input type="password" placeholder="Password" required value={password} onChange={e=>setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 border rounded-lg" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold">
            {loading ? 'Logging in...' : 'Login to Admin Panel'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
