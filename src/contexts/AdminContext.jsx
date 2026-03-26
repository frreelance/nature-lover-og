"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/api/api";

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      if (typeof window === 'undefined') return;
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const response = await api.get("/user/current-user");
      
      if (response.data?.user?.role === "admin") {
        setIsAdmin(true);
        setAdminUser(response.data.user);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
    setIsAdmin(false);
    setAdminUser(null);
  };

  const value = {
    isAdmin,
    loading,
    adminUser,
    checkAdminStatus,
    logout,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};
