"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  ArrowLeft, 
  Clock, 
  Headphones,
  ShieldCheck,
  Loader2,
  CreditCard,
  Banknote
} from 'lucide-react';
import api from '@/api/api';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/utils/ScrollToTop';
import axios from 'axios';

// Move InputField OUTSIDE to prevent re-renders losing focus
const InputField = ({ label, name, placeholder, value, onChange, type = "text", required = true, half = false, disabled = false }) => (
    <div className={`space-y-1.5 ${half ? 'flex-1' : 'w-full'}`}>
        <label className="text-sm font-medium text-gray-700">{label}{required && '*'}</label>
        <input 
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full p-4 bg-white border border-gray-200 rounded-xl focus:border-black outline-none transition-all text-sm font-medium text-gray-800 placeholder:text-gray-200 shadow-sm focus:shadow-md ${disabled ? 'opacity-60 cursor-not-allowed bg-gray-50' : ''}`}
            required={required}
        />
    </div>
);

const CheckoutPage = () => {
  const router = useRouter();
  const { cartItems, getTotalPrice, getItemCount, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    addressType: 'home',
    phone: '',
    email: '',
    description: ''
  });

  useEffect(() => {
    if (user) {
        let first = '';
        let last = '';
        if (user.name) {
            const parts = user.name.split(' ');
            first = parts[0];
            last = parts.slice(1).join(' ');
        }
        setFormData(prev => ({
            ...prev,
            firstName: prev.firstName || first,
            lastName: prev.lastName || last,
            phone: prev.phone || user.phone || '',
            email: prev.email || user.email || ''
        }));
    }
  }, [user]);

  // Auto-fill City/State from Pincode
  useEffect(() => {
    const fetchLocation = async () => {
      if (formData.pincode.length === 6) {
        setPincodeLoading(true);
        try {
          const res = await axios.get(`https://api.postalpincode.in/pincode/${formData.pincode}`);
          if (res.data[0].Status === 'Success') {
            const data = res.data[0].PostOffice[0];
            setFormData(prev => ({
              ...prev,
              city: data.District,
              state: data.State
            }));
            toast.success('Location detected!');
          } else {
            toast.error('Invalid Pincode');
          }
        } catch (err) {
          console.error('Pincode fetch error:', err);
        } finally {
            setPincodeLoading(false);
        }
      }
    };
    fetchLocation();
  }, [formData.pincode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (getItemCount() === 0) return toast.error('Your cart is empty');
    if (!/^\d{6}$/.test(formData.pincode)) return toast.error('Invalid 6-digit pincode');

    setLoading(true);
    try {
      const payload = {
        deliveryAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          addressType: formData.addressType
        },
        contactInfo: {
          phone: formData.phone,
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`.trim()
        },
        notes: formData.description,
        shippingMethod: 'free',
        paymentMethod: paymentMethod
      };

      await api.post('/api/orders', payload);
      setOrderSuccess(true);
      await clearCart();
      toast.success('Order placed successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center py-20 px-6">
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white text-center"
            >
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={32} className="text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Success! Order Confirmed</h1>
                <p className="text-sm text-gray-500 mb-10">We've received your order and started preparing it for transit.</p>
                
                <div className="space-y-4 mb-10 text-left bg-gray-50 p-8 rounded-3xl border border-gray-100">
                    <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            <Clock className="text-indigo-500" size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estimated Arrival</p>
                            <p className="text-sm font-bold text-gray-800">3-7 Business Days</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 pt-2">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            <Banknote className="text-emerald-500" size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment Info</p>
                            <p className="text-sm font-bold text-gray-800">
                                {paymentMethod === 'cod' ? 'Pay at Doorstep (COD)' : 'Paid via Razorpay'}
                            </p>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => router.push('/')}
                    className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all uppercase tracking-widest text-xs"
                >
                    Back to shopping
                </button>
            </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-20 pb-40">
        <button 
           onClick={() => router.push('/cart')}
           className="flex items-center gap-2 text-gray-400 hover:text-black mb-10 transition-all font-bold"
        >
            <ArrowLeft size={16} />
            <span className="text-xs uppercase tracking-widest">Return to Cart</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7 space-y-12">
            <section className="space-y-8">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Shipping Details</h1>
              
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <InputField label="First Name" name="firstName" placeholder="Enter first name" value={formData.firstName} onChange={handleInputChange} half />
                    <InputField label="Last Name" name="lastName" placeholder="Enter last name" value={formData.lastName} onChange={handleInputChange} half />
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    <InputField label="Email Address" name="email" type="email" placeholder="email@example.com" value={formData.email} onChange={handleInputChange} half />
                    <div className="flex-1 space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Phone number*</label>
                        <div className="flex gap-2">
                             <div className="px-4 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 flex items-center justify-center">
                                 IND (+91)
                             </div>
                             <input 
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="888XXXXXXXX"
                                className="flex-1 p-3.5 bg-white border border-gray-200 rounded-xl focus:border-black outline-none text-sm font-medium text-gray-900 transition-all shadow-sm focus:shadow-md"
                                required
                            />
                        </div>
                    </div>
                </div>

                <InputField label="Shipping Address" name="street" placeholder="Flat / House no. / Building..." value={formData.street} onChange={handleInputChange} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                        <InputField label="Pincode" name="pincode" placeholder="Enter Pincode Here" value={formData.pincode} onChange={handleInputChange} />
                        {pincodeLoading && (
                            <div className="absolute right-4 top-10 flex items-center gap-2 text-xs text-gray-400 animate-pulse mt-1">
                                <Loader2 size={12} className="animate-spin" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Locating...</span>
                            </div>
                        )}
                    </div>
                    {/* Auto-filled but editable fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="District" name="city" placeholder="District" value={formData.city} onChange={handleInputChange} />
                        <InputField label="State" name="state" placeholder="State" value={formData.state} onChange={handleInputChange} />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Delivery Notes*</label>
                    <textarea 
                        name="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Any additional details or landmarks?"
                        className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:border-black outline-none text-sm font-medium text-gray-900 transition-all shadow-sm focus:shadow-md resize-none"
                    />
                </div>
              </form>
            </section>

            <section className="space-y-6 pt-10 border-t border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                        <CreditCard size={20} className="text-indigo-600" />
                    </div>
                    Payment Selection
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Cash on Delivery */}
                    <div 
                        onClick={() => setPaymentMethod('cod')}
                        className={`p-6 rounded-2xl border-2 transition-all cursor-pointer group relative overflow-hidden ${
                            paymentMethod === 'cod' 
                            ? 'border-black bg-white shadow-xl shadow-gray-200/50' 
                            : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                        }`}
                    >
                        {paymentMethod === 'cod' && (
                            <div className="absolute top-0 right-0 p-2">
                                <div className="w-2.5 h-2.5 bg-black rounded-full" />
                            </div>
                        )}
                        <div className="flex gap-4 items-center mb-4">
                            <div className={`p-3 rounded-xl transition-colors ${paymentMethod === 'cod' ? 'bg-black text-white' : 'bg-white text-gray-400 border border-gray-100'}`}>
                                <Banknote size={20} />
                            </div>
                            <div>
                                <p className={`font-bold text-sm ${paymentMethod === 'cod' ? 'text-gray-900' : 'text-gray-500'}`}>Cash on Delivery</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pay at your doorstep</p>
                            </div>
                        </div>
                        <div className={`text-xs font-medium leading-relaxed ${paymentMethod === 'cod' ? 'text-gray-600' : 'text-gray-400'}`}>
                            Standard processing. No extra charges for COD orders.
                        </div>
                    </div>

                    {/* Razorpay (Disabled) */}
                    <div className="p-6 rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/30 opacity-60 cursor-not-allowed relative group grayscale">
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <span className="bg-black text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg">Soon Available</span>
                        </div>
                        <div className="flex gap-4 items-center mb-4 blur-[1px]">
                            <div className="p-3 rounded-xl bg-white text-gray-400 border border-gray-100">
                                <CreditCard size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-sm text-gray-500">Online Payment</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">UPI, Cards, Netbanking</p>
                            </div>
                        </div>
                        <div className="text-xs font-medium text-gray-400 blur-[1px]">
                            Powered by Razorpay Secure. Encrypted transactions.
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-6 pt-10 border-t border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Shipping Method</h2>
                <div className="p-6 rounded-2xl border-2 border-black bg-white flex justify-between items-center group cursor-default transition-all shadow-sm">
                    <div className="flex gap-4">
                        <div className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center bg-white shrink-0">
                            <div className="w-2.5 h-2.5 bg-black rounded-full" />
                        </div>
                        <div>
                            <p className="font-bold text-sm">Priority Courier</p>
                            <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-widest font-bold">Delivery within 3-7 Business Days</p>
                        </div>
                    </div>
                    <span className="font-bold text-sm text-green-600 uppercase tracking-widest">FREE</span>
                </div>
                <div className="flex items-center gap-3 px-2 text-gray-400">
                     <ShieldCheck size={18} />
                     <p className="text-[10px] font-bold uppercase tracking-widest">Safe & Secured Transit Verified</p>
                </div>
            </section>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-5">
            <div className="bg-gray-50/50 rounded-3xl p-8 border border-gray-100 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center justify-between">
                    Your Basket
                    <span className="text-xs font-bold text-gray-400 bg-white px-2 py-1 rounded-lg border border-gray-100 uppercase tracking-widest">{getItemCount()} ITEMS</span>
                </h3>
                
                <div className="space-y-6 mb-10 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 relative bg-white shadow-sm">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                            {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-800 leading-tight truncate">{item.name}</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{item.category || item.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">₹{item.price * item.quantity}.00</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 text-sm text-gray-400 font-bold pt-8 border-t border-gray-200 mb-10">
                  <div className="flex justify-between">
                    <span className="uppercase tracking-widest text-[10px]">Purchase Subtotal</span>
                    <span className="text-gray-900 font-bold">₹{getTotalPrice()}.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="uppercase tracking-widest text-[10px]">Shipping Charge</span>
                    <span className="text-green-600 font-bold">₹0.00</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-6 text-gray-900 mt-4">
                    <span className="text-lg font-bold">Total Payable</span>
                    <div className="text-right">
                        <p className="text-3xl font-black tracking-tighter">₹{getTotalPrice()}.00</p>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  form="checkout-form"
                  disabled={loading || getItemCount() === 0}
                  className="w-full bg-black hover:bg-gray-800 text-white py-4.5 rounded-2xl font-bold tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
                >
                  {loading ? 'PROCESSING...' : 'COMPLETE ORDER'}
                </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
