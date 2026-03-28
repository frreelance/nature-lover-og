"use client";
import React from 'react';
import { Tag, Clock } from 'lucide-react';

const AdminOffers = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center space-y-6">
      <div className="p-6 bg-green-50 text-green-600 rounded-full animate-pulse">
        <Tag size={48} />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Campaigns & Offers</h1>
        <p className="text-gray-500 max-w-md mx-auto">
          Manage promotional codes, discounts, and tiered loyalty campaigns.
        </p>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-500 rounded-full text-xs font-bold uppercase tracking-widest border border-gray-100">
        <Clock size={14} />
        <span>This will be implemented soon</span>
      </div>
    </div>
  );
};

export default AdminOffers;
