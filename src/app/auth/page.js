"use client";
import React, { useEffect, useMemo, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Leaf, Mail, Lock, User, Phone } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/utils/ScrollToTop';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import Toast from '@/components/Toast';

const AuthContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login, register, isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();

  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  useEffect(() => {
    const m = searchParams.get('mode');
    if (m === 'register') setMode('register');
    else setMode('login');
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') router.push('/admin/dashboard');
      else router.push('/plants');
    }
  }, [isAuthenticated, user, router]);

  const title = useMemo(() => (mode === 'login' ? 'Welcome Back' : 'Join Nature Lovers'), [mode]);

  const onSubmitLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(loginData.email, loginData.password);
    if (result.success) {
      const pendingAdd = localStorage.getItem('pendingAddToCart');
      if (pendingAdd) {
        try {
          const parsed = JSON.parse(pendingAdd);
          localStorage.removeItem('pendingAddToCart');
          await addToCart(parsed.item, parsed.type);
          router.push('/cart');
          return;
        } catch {
          localStorage.removeItem('pendingAddToCart');
        }
      }
      if (result.user?.role === 'admin') router.push('/admin/dashboard');
      else router.push('/plants');
    } else {
      setError(result.message || 'Login failed');
    }
    setLoading(false);
  };

  const onSubmitRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    const result = await register(registerData.name, registerData.email, registerData.password, registerData.phone);
    if (result.success) {
      router.push('/plants');
    } else {
      setError(result.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <ScrollToTop />
      <Header />
      <div className="py-20 pt-32">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-10">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-green-500 p-3 rounded-full"><Leaf className="h-8 w-8 text-white" /></div>
              <h1 className="text-4xl font-bold text-green-800">{title}</h1>
            </div>
            <p className="text-gray-600 mb-6">{mode === 'login' ? 'Login to track your services' : 'Create an account to start'}</p>
            <div className="bg-gray-100 p-1 rounded-2xl border w-fit flex">
              <button 
                onClick={() => router.push('/auth?mode=login')}
                className={`px-5 py-2 rounded-2xl text-sm font-semibold ${mode === 'login' ? 'bg-white shadow-sm text-green-700' : 'text-gray-600'}`}
              >Login</button>
              <button 
                onClick={() => router.push('/auth?mode=register')}
                className={`px-5 py-2 rounded-2xl text-sm font-semibold ${mode === 'register' ? 'bg-white shadow-sm text-green-700' : 'text-gray-600'}`}
              >Register</button>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
            {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">{error}</div>}
            <form onSubmit={mode === 'login' ? onSubmitLogin : onSubmitRegister} className="space-y-4">
              {mode === 'register' && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type="text" placeholder="Full Name" required value={registerData.name} onChange={e=>setRegisterData(p=>({...p, name:e.target.value}))} className="w-full pl-10 pr-4 py-3 border rounded-xl" />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="email" placeholder="Email" required value={mode === 'login' ? loginData.email : registerData.email} onChange={e=>mode==='login'?setLoginData(p=>({...p, email:e.target.value})):setRegisterData(p=>({...p, email:e.target.value}))} className="w-full pl-10 pr-4 py-3 border rounded-xl" />
              </div>
              {mode === 'register' && (
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type="tel" placeholder="Phone" required value={registerData.phone} onChange={e=>setRegisterData(p=>({...p, phone:e.target.value}))} className="w-full pl-10 pr-4 py-3 border rounded-xl" />
                </div>
              )}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} placeholder="Password" required value={mode === 'login' ? loginData.password : registerData.password} onChange={e=>mode==='login'?setLoginData(p=>({...p, password:e.target.value})):setRegisterData(p=>({...p, password:e.target.value}))} className="w-full pl-10 pr-4 py-3 border rounded-xl" />
                <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-green-700">{showPassword?'HIDE':'SHOW'}</button>
              </div>
              {mode === 'register' && (
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type="password" placeholder="Confirm Password" required value={registerData.confirmPassword} onChange={e=>setRegisterData(p=>({...p, confirmPassword:e.target.value}))} className="w-full pl-10 pr-4 py-3 border rounded-xl" />
                </div>
              )}
              <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold shadow-lg">
                {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
