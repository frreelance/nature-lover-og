"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, Plus, Trash2, Check, ArrowLeft } from 'lucide-react';
import api from '@/api/api';
import toast from 'react-hot-toast';

const AddProduct = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'Indoor', // Default for plants
    type: 'plant',
    stock: '',
    isAvailable: true,
    size: 'Small', // Default for plants
    potIncluded: false,
    duration: '',
    serviceDetails: [''],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setProduct(prev => ({
        ...prev,
        type,
        category: type === 'plant' ? 'Indoor' : 'Park and Lawn'
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    const uploadedUrls = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await api.post('/api/admin/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        uploadedUrls.push(data.url);
      }
      setImages(prev => [...prev, ...uploadedUrls]);
      toast.success('Images uploaded successfully');
    } catch (error) {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleServiceDetailChange = (index, value) => {
    const updatedDetails = [...product.serviceDetails];
    updatedDetails[index] = value;
    setProduct(prev => ({ ...prev, serviceDetails: updatedDetails }));
  };

  const addServiceDetail = () => {
    setProduct(prev => ({ ...prev, serviceDetails: [...prev.serviceDetails, ''] }));
  };

  const removeServiceDetail = (index) => {
    setProduct(prev => ({
      ...prev,
      serviceDetails: prev.serviceDetails.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) return toast.error('Please upload at least one image');
    
    setLoading(true);
    try {
      const payload = { ...product, images };
      await api.post('/api/admin/products', payload);
      toast.success('Product added successfully');
      router.push('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-green-600 mb-6 transition-colors"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-green-600 p-8 text-white">
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="opacity-90">Create a new plant or service for your store</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Type</label>
              <select 
                name="type" 
                value={product.type} 
                onChange={handleTypeChange}
                className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500"
              >
                <option value="plant">Plant</option>
                <option value="service" >Service</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Category</label>
              <select 
                name="category" 
                value={product.category} 
                onChange={handleInputChange}
                className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500"
                required
              >
                {product.type === 'plant' ? (
                    <>
                        <option value="Indoor">Indoor</option>
                        <option value="Outdoor">Outdoor</option>
                    </>
                ) : (
                    <>
                        <option value="Park and Lawn">Park and Lawn</option>
                        <option value="Home / Balcony">Home / Balcony</option>
                    </>
                )}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Product Name</label>
            <input 
              type="text" 
              name="name" 
              placeholder="Enter product title"
              value={product.name} 
              onChange={handleInputChange}
              className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500 font-medium"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Description (One line only)</label>
            <input 
              type="text" 
              name="description" 
              placeholder="Short description of the product..."
              value={product.description} 
              onChange={handleInputChange}
              className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500 truncate"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Price (₹)</label>
              <input 
                type="number" 
                name="price" 
                value={product.price} 
                onChange={handleInputChange}
                className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500 font-bold"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Original Price (₹)</label>
              <input 
                type="number" 
                name="originalPrice" 
                value={product.originalPrice} 
                onChange={handleInputChange}
                className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Conditional Fields: Plants */}
          {product.type === 'plant' && (
            <div className="space-y-6 animate-fade-in pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Size</label>
                  <select 
                    name="size" 
                    value={product.size} 
                    onChange={handleInputChange}
                    className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Small">Small</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Large">Large</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Stock Count</label>
                  <input 
                    type="number" 
                    name="stock" 
                    value={product.stock} 
                    onChange={handleInputChange}
                    className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="flex items-center gap-4 h-full pt-8">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-6 h-6 rounded-lg accent-green-600 cursor-pointer"
                      checked={product.potIncluded}
                      onChange={(e) => setProduct(prev => ({ ...prev, potIncluded: e.target.checked }))}
                    />
                    <span className="font-semibold text-gray-800">Pot Included?</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Conditional Fields: Services */}
          {product.type === 'service' && (
            <div className="space-y-6 animate-fade-in pt-4 border-t border-gray-100">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Service Duration</label>
                <input 
                  type="text" 
                  name="duration" 
                  placeholder="e.g. 2 hours, Monthly Subscription"
                  value={product.duration} 
                  onChange={handleInputChange}
                  className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-gray-700">Service Details / Benefits</label>
                  <button type="button" onClick={addServiceDetail} className="text-green-600 hover:text-green-700 flex items-center gap-1 text-sm font-extrabold uppercase tracking-tighter">
                    <Plus size={16} /> Add Detail
                  </button>
                </div>
                {product.serviceDetails.map((detail, index) => (
                  <div key={index} className="flex gap-2">
                    <input 
                      type="text" 
                      value={detail} 
                      onChange={(e) => handleServiceDetailChange(index, e.target.value)}
                      className="flex-1 p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500"
                      placeholder="Add a service highlight..."
                    />
                    <button type="button" onClick={() => removeServiceDetail(index)} className="p-4 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Image Upload */}
          <div className="space-y-4">
            <label className="text-sm font-semibold text-gray-700">Product Images</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((url, idx) => (
                <div key={idx} className="relative aspect-square rounded-3xl overflow-hidden group border border-gray-100 shadow-sm">
                  <img src={url} alt="Product" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  <button 
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-3 right-3 p-2 bg-red-500/90 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              
              <label className="aspect-square rounded-3xl border-3 border-dashed border-gray-100 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all text-gray-300 hover:text-green-600 group">
                {uploading ? (
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
                ) : (
                  <>
                    <Upload size={32} className="group-hover:bounce" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Add Photo</span>
                  </>
                )}
                <input type="file" multiple className="hidden" onChange={handleImageUpload} accept="image/*" disabled={uploading} />
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white p-6 rounded-3xl font-black text-xl shadow-[0_20px_50px_rgba(22,163,74,0.3)] transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Publishing...' : <><Check /> Publish Product</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
