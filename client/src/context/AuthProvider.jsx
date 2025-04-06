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

  // AuthProvider.js
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post("/auth/register", userData);

      if (response.status === 201) {
        const token = response.data.data.token;
        localStorage.setItem("token", token);
        setToken(token);
        await checkAuth();
        return token;
      }
      throw new Error("Registration failed - no token received");
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage =
        error.response?.data?.message || error.message || "Registration failed";
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
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
        console.log("Auth response:", response.data); // ✅ ini log lengkap
        console.log("User data:", response.data?.data); // ✅ ini data yang
        // Handle 204 No Content response
        if (response.status === 204) {
          setUser(null);
          logout(); // Clear invalid token
        } else {
          setUser(response.data?.data || null);
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
        register,
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
