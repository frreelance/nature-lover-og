"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Trash2, Edit, Filter, Eye, X } from 'lucide-react';
import api from '@/api/api';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Product Catalog</h1>
          <p className="text-gray-500 text-sm">Efficiently manage your inventory and services</p>
        </div>
        <button 
          onClick={() => router.push('/admin/products/add')}
          className="bg-black text-white px-8 py-3.5 rounded-2xl font-bold transition-all flex items-center gap-2 transform active:scale-95 text-sm shadow-xl shadow-gray-200"
        >
          <Plus size={18} /> New Item
        </button>
      </div>

      <div className="bg-white p-3 rounded-2xl border border-gray-100 flex flex-col md:flex-row gap-4 items-center shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search catalog..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-1 focus:ring-black outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5 bg-gray-50 p-1 rounded-xl">
            {['all', 'plant', 'service'].map(type => (
                <button 
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-5 py-2 rounded-lg text-xs font-bold capitalize transition-all ${filterType === type ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-black'}`}
                >
                    {type === 'all' ? 'Everything' : type + 's'}
                </button>
            ))}
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center animate-pulse text-gray-400 font-medium">Loading inventory...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto shadow-sm no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px] md:min-w-full">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Availability</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 leading-tight">{product.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter italic">{product.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{product.category}</span>
                  </td>
                  <td className="px-6 py-3">
                    <p className="text-sm font-black text-gray-900">₹{product.price}</p>
                  </td>
                  <td className="px-6 py-3">
                    {product.type === 'plant' ? (
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {product.stock > 0 ? `${product.stock} units` : 'Legacy'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">Service</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { setSelectedProduct(product); setShowModal(true); }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Quick View"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => router.push(`/admin/products/edit/${product._id}`)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                        title="Edit Item"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => deleteProduct(product._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail View Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-in">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 aspect-square bg-gray-50">
                <img src={selectedProduct.images[0]} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="md:w-1/2 p-8 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600 mb-1">{selectedProduct.category}</p>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">{selectedProduct.name}</h3>
                  </div>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X size={20}/></button>
                </div>

                <div className="space-y-6 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-gray-900">₹{selectedProduct.price}</span>
                    {selectedProduct.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">₹{selectedProduct.originalPrice}</span>
                    )}
                  </div>

                  <div className="space-y-4 pt-6 border-t border-gray-50 text-sm text-gray-500 leading-relaxed">
                    <p>{selectedProduct.description || 'No description provided.'}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-2xl">
                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-widest">Type</p>
                        <p className="text-gray-900 font-bold capitalize">{selectedProduct.type}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-2xl">
                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-widest">Available</p>
                        <p className="text-gray-900 font-bold">{selectedProduct.stock || '∞'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                   <button 
                      onClick={() => router.push(`/admin/products/edit/${selectedProduct._id}`)}
                      className="flex-1 bg-black text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest active:scale-95 transition-all"
                   >
                     Update Profile
                   </button>
                </div>
              </div>
            </div>
          </div>
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
