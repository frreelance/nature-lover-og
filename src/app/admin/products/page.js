"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Trash2, Edit, Filter, LayoutGrid, List } from 'lucide-react';
import api from '@/api/api';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/api/admin/products');
      setProducts(data.data);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/api/admin/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
      toast.success('Product deleted');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || p.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Inventory Management</h1>
          <p className="text-gray-500">Manage your plants and services</p>
        </div>
        <button 
          onClick={() => router.push('/admin/products/add')}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-3xl font-bold shadow-xl shadow-green-200 transition-all flex items-center gap-2 transform hover:-translate-y-1 active:scale-95"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500" size={20} />
          <input 
            type="text" 
            placeholder="Search by name or category..."
            className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setFilterType('all')}
                className={`px-6 py-4 rounded-2xl font-semibold transition-all ${filterType === 'all' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
            >
                All
            </button>
            <button 
                onClick={() => setFilterType('plant')}
                className={`px-6 py-4 rounded-2xl font-semibold transition-all ${filterType === 'plant' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
            >
                Plants
            </button>
            <button 
                onClick={() => setFilterType('service')}
                className={`px-6 py-4 rounded-2xl font-semibold transition-all ${filterType === 'service' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
            >
                Services
            </button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center animate-pulse text-gray-400 font-medium">Loading inventory...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-gray-50 group transform hover:-translate-y-2">
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 left-4">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md border border-white/20 ${product.type === 'plant' ? 'bg-green-500/80 text-white' : 'bg-blue-500/80 text-white'}`}>
                    {product.type}
                  </span>
                </div>
              </div>
              
              <div className="p-8">
                <div className="mb-4">
                  <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">{product.category}</p>
                  <h3 className="text-xl font-bold text-gray-800 line-clamp-1">{product.name}</h3>
                </div>
                
                <div className="flex justify-between items-end mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-gray-900">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                    )}
                  </div>
                  {product.type === 'plant' && (
                    <span className={`text-xs font-bold ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  )}
                </div>

                <div className="flex gap-3 pt-6 border-t border-gray-100">
                  <button 
                    onClick={() => router.push(`/admin/products/edit/${product._id}`)}
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-gray-50 hover:bg-green-50 text-gray-600 hover:text-green-600 rounded-2xl font-bold transition-all"
                  >
                    <Edit size={18} /> Edit
                  </button>
                  <button 
                    onClick={() => deleteProduct(product._id)}
                    className="p-4 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-2xl transition-all"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-gray-50/50 rounded-[3rem] border-4 border-dashed border-gray-100">
          <p className="text-xl font-bold text-gray-400">No products found</p>
          <button onClick={() => router.push('/admin/products/add')} className="mt-4 text-green-600 font-bold hover:underline">Add your first product</button>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
