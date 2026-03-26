"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api.js';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from API on mount
  useEffect(() => {
    loadCartFromAPI();
  }, []);

  const loadCartFromAPI = async () => {
    // Only attempt to load from API if we have a token
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    
    if (!token) {
      // If no token, just load from localStorage if available
      if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem('natureLoversCart');
        if (savedCart) {
          try {
            setCartItems(JSON.parse(savedCart));
          } catch (e) {
            setCartItems([]);
          }
        }
      }
      setIsInitialized(true);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get('/api/cart');
      if (response.data.success) {
        setCartItems(response.data.data.items || []);
        if (typeof window !== 'undefined') {
            localStorage.setItem('natureLoversCart', JSON.stringify(response.data.data.items || []));
        }
      }
    } catch (error) {
      console.error('Error loading cart from API:', error);
      // Fallback to localStorage if API fails
      if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem('natureLoversCart');
        if (savedCart) {
          try {
            setCartItems(JSON.parse(savedCart));
          } catch (parseError) {
            setCartItems([]);
          }
        }
      }
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  };

  const addToCart = async (item, type = 'plant') => {
    try {
      const cartItem = {
        itemId: item.id.toString(),
        name: item.name || item.title,
        type,
        price: typeof item.price === 'number' ? item.price : 0,
        quantity: item.quantity || 1,
        image: item.image || item.image_url,
        category: item.category
      };

      const token = localStorage.getItem('accessToken');
      if (!token) {
        // Just Update locally if not logged in
        setCartItems(prev => {
            const existing = prev.find(i => i.itemId === cartItem.itemId && i.type === type);
            let updated;
            if (existing) {
                updated = prev.map(i => i.itemId === cartItem.itemId && i.type === type ? { ...i, quantity: i.quantity + cartItem.quantity } : i);
            } else {
                updated = [...prev, cartItem];
            }
            localStorage.setItem('natureLoversCart', JSON.stringify(updated));
            return updated;
        });
        return { success: true };
      }

      const response = await api.post('/api/cart/add', cartItem);
      
      if (response.data.success) {
        setCartItems(response.data.data.items || []);
        localStorage.setItem('natureLoversCart', JSON.stringify(response.data.data.items || []));
        return { success: true };
      }

      return { success: false, message: response.data?.message || 'Failed to add to cart' };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false };
    }
  };

  const removeFromCart = async (id, type) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setCartItems(prev => {
            const updated = prev.filter(item => !(item.itemId === id.toString() && item.type === type));
            localStorage.setItem('natureLoversCart', JSON.stringify(updated));
            return updated;
        });
        return;
      }

      const response = await api.delete('/api/cart/remove', {
        data: { itemId: id.toString(), type }
      });
      
      if (response.data.success) {
        setCartItems(response.data.data.items || []);
        localStorage.setItem('natureLoversCart', JSON.stringify(response.data.data.items || []));
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (id, type, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id, type);
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setCartItems(prev => {
            const updated = prev.map(item => item.itemId === id.toString() && item.type === type ? { ...item, quantity: newQuantity } : item);
            localStorage.setItem('natureLoversCart', JSON.stringify(updated));
            return updated;
        });
        return;
      }

      const response = await api.put('/api/cart/update', {
        itemId: id.toString(),
        type,
        quantity: newQuantity
      });
      
      if (response.data.success) {
        setCartItems(response.data.data.items || []);
        localStorage.setItem('natureLoversCart', JSON.stringify(response.data.data.items || []));
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const incrementQuantity = async (id, type) => {
    const currentItem = cartItems.find(item => item.itemId === id.toString() && item.type === type);
    if (currentItem) {
      await updateQuantity(id, type, currentItem.quantity + 1);
    }
  };

  const decrementQuantity = async (id, type) => {
    const currentItem = cartItems.find(item => item.itemId === id.toString() && item.type === type);
    if (currentItem) {
      if (currentItem.quantity <= 1) {
        await removeFromCart(id, type);
      } else {
        await updateQuantity(id, type, currentItem.quantity - 1);
      }
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setCartItems([]);
        localStorage.removeItem('natureLoversCart');
        return;
      }

      const response = await api.delete('/api/cart/clear');
      if (response.data.success) {
        setCartItems([]);
        localStorage.removeItem('natureLoversCart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.price === 'number' ? item.price : 0;
      return total + price * item.quantity;
    }, 0);
  };

  const getItemCount = () => {
    return cartItems.length;
  };

  const value = {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    loading,
    isInitialized,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getItemCount,
    loadCartFromAPI
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
