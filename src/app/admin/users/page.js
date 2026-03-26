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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Users Management</h1>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search by name/email..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-xl" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map(u => (
              <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-700">{u.fullName.charAt(0)}</div>
                    <div>
                      <p className="font-bold">{u.fullName}</p>
                      <p className="text-xs text-gray-400">ID: {u._id.slice(-6)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium">{u.email}</div>
                  <div className="text-xs text-gray-500">{u.phone || 'N/A'}</div>
                </td>
                <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>{u.role || 'user'}</span></td>
                <td className="px-6 py-4 text-sm font-medium">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-center"><button onClick={()=>viewUserDetails(u._id)} className="text-green-600 hover:underline font-bold text-sm">View Details</button></td>
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
