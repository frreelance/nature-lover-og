"use client";
import React from 'react';
import { Plus, Minus, Trash2, Leaf, Wrench } from 'lucide-react';

const CartItem = ({ item, onIncrement, onDecrement, onRemove }) => {
  return (
    <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center space-x-4">
        {/* Item Image */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
            {item.type === 'plant' ? (
              <Leaf className="h-8 w-8 text-green-600" />
            ) : (
              <Wrench className="h-8 w-8 text-blue-600" />
            )}
          </div>
        </div>

        {/* Item Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {item.name}
          </h3>
          <p className="text-sm text-gray-600 capitalize">
            {item.type} • {item.category || 'General'}
          </p>
          <p className="text-lg font-bold text-green-600">
            ₹{item.price.toLocaleString()}
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onDecrement(item.id, item.type)}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-300"
          >
            <Minus className="h-4 w-4 text-gray-600" />
          </button>
          
          <span className="w-8 text-center font-semibold text-gray-800">
            {item.quantity}
          </span>
          
          <button
            onClick={() => onIncrement(item.id, item.type)}
            className="w-8 h-8 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors duration-300"
          >
            <Plus className="h-4 w-4 text-green-600" />
          </button>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(item.id, item.type)}
          className="text-red-500 hover:text-red-700 transition-colors duration-300 p-2"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Item Total */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Item Total:</span>
          <span className="text-lg font-bold text-green-600">
            ₹{(item.price * item.quantity).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;

