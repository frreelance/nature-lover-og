"use client";
import React, { useState, useEffect } from 'react';
import api from '@/api/api';
import { Tag, Plus, CheckCircle2, RotateCcw, Activity, StopCircle, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminOffers = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    discountPercentage: '',
    targetType: 'all',
    isActive: true
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await api.get('/api/admin/coupons');
      if (res.data.success) {
        setCoupons(res.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discountPercentage) return;
    
    setCreating(true);
    try {
      const res = await api.post('/api/admin/coupons', formData);
      if (res.data.success) {
        toast.success('Coupon created successfully!');
        setCoupons([res.data.data, ...coupons]);
        setShowModal(false);
        setFormData({ code: '', discountPercentage: '', targetType: 'all', isActive: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create coupon');
    } finally {
      setCreating(false);
    }
  };

  const toggleCouponStatus = (id, currentStatus) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-bold text-gray-900">
          Are you sure you want to {currentStatus ? 'deactivate' : 'activate'} this coupon?
        </p>
        <div className="flex gap-2">
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await api.put(`/api/admin/coupons/${id}`, { isActive: !currentStatus });
                if (res.data.success) {
                  setCoupons(prev => prev.map(c => c._id === id ? res.data.data : c));
                  toast.success(`Coupon ${!currentStatus ? 'activated' : 'deactivated'}`);
                }
              } catch (error) {
                toast.error('Failed to update coupon status');
              }
            }}
            className={`px-4 py-2 ${currentStatus ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-600 hover:bg-green-700'} text-white text-xs font-bold rounded-lg transition-colors`}
          >
            Yes, {currentStatus ? 'deactivate' : 'activate'}
          </button>
          <button 
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 6000, position: 'top-center' });
  };

  const deleteCoupon = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-bold text-gray-900">Are you sure you want to delete this coupon?</p>
        <div className="flex gap-2">
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await api.delete(`/api/admin/coupons/${id}`);
                if (res.data.success) {
                  setCoupons(prev => prev.filter(c => c._id !== id));
                  toast.success("Coupon deleted successfully");
                }
              } catch (error) {
                toast.error("Failed to delete coupon");
              }
            }}
            className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors"
          >
            Yes, delete
          </button>
          <button 
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 6000, position: 'top-center' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Tag className="text-green-600" /> Coupon Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">Create one-time use coupons for users</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all focus:ring-4 focus:ring-gray-200"
        >
          <Plus size={16} /> New Coupon
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
           <div className="flex justify-center items-center py-20">
              <RotateCcw className="animate-spin text-gray-300" size={32} />
           </div>
        ) : coupons.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                 <Tag size={24} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No Coupons Yet</h3>
              <p className="text-gray-500 text-sm max-w-sm">Create your first coupon to offer discounts to your customers.</p>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100 font-bold tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4">Code</th>
                  <th scope="col" className="px-6 py-4">Discount</th>
                  <th scope="col" className="px-6 py-4">Target</th>
                  <th scope="col" className="px-6 py-4">Users Used</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4 text-right">Created</th>
                  <th scope="col" className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">
                       <span className="bg-green-50 text-green-700 px-3 py-1 rounded-lg border border-green-100 text-xs tracking-widest">{coupon.code}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                       {coupon.discountPercentage}% OFF
                    </td>
                    <td className="px-6 py-4 uppercase text-[10px] font-bold tracking-widest text-gray-500">
                       {coupon.targetType}
                    </td>
                    <td className="px-6 py-4">
                       <span className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded-full text-xs font-bold">{coupon.usedBy?.length || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                        <button 
                            onClick={() => toggleCouponStatus(coupon._id, coupon.isActive)}
                            className="transition-transform hover:scale-105 active:scale-95 duration-200"
                        >
                            {coupon.isActive ? (
                                <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full w-fit">
                                    <Activity size={12} /> Active
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full w-fit">
                                    <StopCircle size={12} /> Disabled
                                </span>
                            )}
                        </button>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap text-xs font-medium text-gray-400">
                       {new Date(coupon.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                        <button 
                           onClick={() => deleteCoupon(coupon._id)}
                           className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                           title="Delete Coupon"
                        >
                           <Trash2 size={16} />
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Tag size={18} className="text-green-600" /> Create New Coupon
                </h3>
            </div>
            <form onSubmit={handleCreateCoupon} className="p-6 space-y-5">
               <div className="space-y-1.5">
                   <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Coupon Code</label>
                   <input 
                      type="text" 
                      required
                      placeholder="e.g. FIRST100"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-black outline-none transition-all font-bold text-gray-900 uppercase"
                   />
               </div>
               
               <div className="space-y-1.5">
                   <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Discount Percentage (%)</label>
                   <input 
                      type="number" 
                      required
                      min="1"
                      max="100"
                      placeholder="e.g. 100"
                      value={formData.discountPercentage}
                      onChange={(e) => setFormData({...formData, discountPercentage: e.target.value})}
                      className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-black outline-none transition-all font-medium text-gray-900"
                   />
               </div>

               <div className="space-y-1.5">
                   <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Target Items</label>
                   <select 
                      value={formData.targetType}
                      onChange={(e) => setFormData({...formData, targetType: e.target.value})}
                      className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-black outline-none transition-all font-medium text-gray-900"
                   >
                       <option value="all">All Items</option>
                       <option value="service">Services Only</option>
                       <option value="plant">Plants Only</option>
                   </select>
               </div>

               <div className="flex items-center gap-3 py-2">
                   <input 
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="w-5 h-5 accent-black rounded cursor-pointer"
                   />
                   <label htmlFor="isActive" className="text-sm font-bold text-gray-800 cursor-pointer">Activate immediately</label>
               </div>

               <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                    <button 
                       type="button" 
                       onClick={() => setShowModal(false)}
                       className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                       type="submit" 
                       disabled={creating}
                       className="px-6 py-2.5 bg-black hover:bg-gray-800 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {creating ? <RotateCcw className="animate-spin" size={16} /> : <CheckCircle2 size={16} />} 
                        Create Coupon
                    </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOffers;
