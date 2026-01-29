import { useState, useEffect } from "react";
import api from "../lib/api";
import { AuthContext } from "./authContextDefinition";

export const AuthProvider = ({ children }) => {
  // Lazy initialization: read from localStorage only once during initial render
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
        // Clean up corrupted data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Verify token with backend
          const res = await api.get("/api/auth/verify");
          if (res.data.success) {
            setUser(res.data.user);
            setAuthError(null);
          } else {
            throw new Error("Invalid token");
          }
        } catch (error) {
          console.error("Session expired or invalid:", error);
          // Clear invalid session
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
          setAuthError(error.response?.data?.message || "Session expired");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const register = async (email, password) => {
    try {
      setAuthError(null);
      const res = await api.post("/api/auth/register", { email, password });
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: "Registration failed" };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Registration failed. Please try again.";
      setAuthError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const login = async (email, password) => {
    try {
      setAuthError(null);
      const res = await api.post("/api/auth/login", { email, password });
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: "Login failed" };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setAuthError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, authError, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
