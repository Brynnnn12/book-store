// Perbaikan AuthProvider.js
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/axiosConfig";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const login = async (token) => {
    localStorage.setItem("token", token);
    setToken(token);
    await checkAuth();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // AuthProvider.js
  const checkAuth = async () => {
    try {
      setLoading(true);
      if (token) {
        const response = await api.get("/auth/profile");
        // Handle 204 No Content response
        if (response.status === 204) {
          setUser(null);
          logout(); // Clear invalid token
        } else {
          setUser(response.data?.data?.user || null);
        }
      }
    } catch (error) {
      console.error("Auth check error:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    checkAuth();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
