"use client";
import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { AdminProvider } from "@/contexts/AdminContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Toaster } from "react-hot-toast";
import FloatingPromoCard from "@/components/FloatingPromoCard";

export default function Providers({ children }) {
  return (
    <ErrorBoundary>
      <AdminProvider>
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster position="top-center" />
            <FloatingPromoCard />
          </CartProvider>
        </AuthProvider>
      </AdminProvider>
    </ErrorBoundary>
  );
}
