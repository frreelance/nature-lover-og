"use client";
import React, { useState, useEffect } from 'react';
import { Search, User, Mail, Phone, ShoppingBag, X } from 'lucide-react';
import api from '@/api/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, totalPages: 1 });

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/users', {
        params: { page: pagination.page, limit: pagination.limit, search: searchTerm }
      });
      setUsers(response.data.data.users);
      setPagination(prev => ({ ...prev, ...response.data.data.pagination }));
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewUserDetails = async (userId) => {
    try {
      const response = await api.get(`/api/admin/users/${userId}`);
      setSelectedUser(response.data.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-start mb-6">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search member name or email..." 
            value={searchTerm} 
            onChange={e=>setSearchTerm(e.target.value)} 
            className="w-full pl-12 pr-4 py-3 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-purple-100 outline-none transition-all shadow-sm bg-white" 
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 text-xs font-semibold text-gray-500 border-b border-gray-100">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Joined On</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(u => (
              <tr key={u._id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-sm">
                      {u.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 leading-tight">{u.fullName}</p>
                      <p className="text-xs text-gray-500">#{u._id.slice(-6).toUpperCase()}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-700 font-medium">{u.email}</div>
                  <div className="text-xs text-gray-500">{u.phone || 'No phone'}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {u.role ? u.role.charAt(0).toUpperCase() + u.role.slice(1) : 'User'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-700">
                    {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-center">
                    <button 
                        onClick={()=>viewUserDetails(u._id)} 
                        className="px-3 py-1.5 text-xs font-semibold text-purple-600 hover:text-white border border-purple-200 hover:bg-purple-600 rounded-lg transition-all"
                    >
                        View Profile
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-gray-900">User Profile</h2>
              <button 
                onClick={()=>setShowModal(false)}
                className="p-2 hover:bg-gray-50 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-400 hover:text-gray-900" />
              </button>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-center gap-6 p-6 bg-purple-50 rounded-3xl border border-purple-100">
                <div className="w-20 h-20 bg-white text-purple-600 rounded-3xl flex items-center justify-center text-3xl font-bold shadow-sm border border-purple-100">
                  {selectedUser.user.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedUser.user.fullName}</h3>
                  <p className="text-sm font-medium text-purple-600/80">{selectedUser.user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">{selectedUser.user.phone || 'No phone provided'}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-5 bg-white border border-gray-100 rounded-2xl text-center shadow-sm">
                  <p className="text-2xl font-black text-gray-900">{selectedUser.stats.totalOrders}</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-1">Orders</p>
                </div>
                <div className="p-5 bg-white border border-gray-100 rounded-2xl text-center shadow-sm">
                  <p className="text-2xl font-black text-green-600">{selectedUser.stats.completedOrders}</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-1">Success</p>
                </div>
                <div className="p-5 bg-white border border-gray-100 rounded-2xl text-center shadow-sm">
                  <p className="text-xl font-black text-purple-600">₹{selectedUser.stats.totalSpent.toLocaleString()}</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-1">Spent</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Account Role</p>
                   <p className="text-sm font-bold text-gray-900 capitalize">{selectedUser.user.role || 'User'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Joined Date</p>
                   <p className="text-sm font-bold text-gray-900">{new Date(selectedUser.user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex gap-4">
               <button 
                onClick={()=>setShowModal(false)}
                className="w-full py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95"
               >
                 Close Details
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
