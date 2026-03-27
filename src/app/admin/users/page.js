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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Active Members</h1>
          <p className="text-gray-500 text-sm">Monitor user activity and account status</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search members..." 
            value={searchTerm} 
            onChange={e=>setSearchTerm(e.target.value)} 
            className="w-full pl-10 pr-4 py-2 border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-black outline-none transition-all bg-gray-50/50" 
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">
              <th className="px-6 py-4">User Identity</th>
              <th className="px-6 py-4">Contact Gateway</th>
              <th className="px-6 py-4">Privileges</th>
              <th className="px-6 py-4">Onboarded</th>
              <th className="px-6 py-4 text-center">Insights</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map(u => (
              <tr key={u._id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600 text-[13px]">{u.fullName.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 leading-tight">{u.fullName}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter italic">#{u._id.slice(-6)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3">
                  <div className="text-sm font-medium text-gray-700">{u.email}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{u.phone || 'NO PHONE'}</div>
                </td>
                <td className="px-6 py-3">
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {u.role || 'user'}
                  </span>
                </td>
                <td className="px-6 py-3">
                    <p className="text-sm font-bold text-gray-900">{new Date(u.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="px-6 py-3 text-center">
                    <button 
                        onClick={()=>viewUserDetails(u._id)} 
                        className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">User Info</h2>
              <button onClick={()=>setShowModal(false)}><X/></button>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center text-3xl">👤</div>
                <div>
                  <h3 className="text-xl font-bold">{selectedUser.user.fullName}</h3>
                  <p className="text-gray-500">{selectedUser.user.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedUser.stats.totalOrders}</p>
                  <p className="text-xs font-bold">Orders</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-green-600">{selectedUser.stats.completedOrders}</p>
                  <p className="text-xs font-bold">Completed</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl text-center">
                  <p className="text-xl font-bold text-purple-600">₹{selectedUser.stats.totalSpent}</p>
                  <p className="text-xs font-bold">Spent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
