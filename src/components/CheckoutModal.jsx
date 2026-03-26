"use client";
import React from 'react';
import { X, ShoppingCart, Leaf, Wrench, CheckCircle, AlertCircle } from 'lucide-react';

const CheckoutModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  cartItems, 
  totalAmount, 
  totalItems, 
  user,
  loading = false 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Confirm Your Order</h2>
              <p className="text-sm text-gray-600">Please review your order before proceeding</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            disabled={loading}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Customer Info */}
          <div className="bg-green-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Customer Information
            </h3>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>
                <span className="ml-2 font-medium">{user?.name}</span>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>
                <span className="ml-2 font-medium">{user?.email}</span>
              </div>
              <div>
                <span className="text-gray-600">Phone:</span>
                <span className="ml-2 font-medium">{user?.phone || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-gray-600">Total Items:</span>
                <span className="ml-2 font-medium">{totalItems}</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              Order Items ({cartItems.length})
            </h3>
            <div className="space-y-3">
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${item.type}-${index}`} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                      {item.type === 'plant' ? (
                        <Leaf className="h-5 w-5 text-green-600" />
                      ) : (
                        <Wrench className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600 capitalize">
                        {item.type} • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      ₹{item.price.toLocaleString()} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Items ({totalItems})</span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service Charge</span>
                <span>₹0</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between text-lg font-bold text-green-800">
                <span>Total Amount</span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="mt-4 p-4 bg-blue-50 rounded-xl">
            <h4 className="font-semibold text-blue-800 mb-2">Important Notes:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Your order will be confirmed and sent to WhatsApp</li>
              <li>• We'll contact you within 24 hours for delivery details</li>
              <li>• Delivery address and timing will be discussed via WhatsApp</li>
              <li>• Payment will be collected upon delivery</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-8 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Confirm Order</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;

