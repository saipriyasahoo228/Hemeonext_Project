import { createContext, useContext, useState, useEffect } from "react";
import { checkAuthStatus, logoutUser, refreshToken } from "../api/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const authData = await checkAuthStatus();
        console.log("Initial Auth Check:", authData);
        setIsAuthenticated(authData.isAuthenticated);
        setUser(authData.user);
        if (authData.user) localStorage.setItem("user", JSON.stringify(authData.user));
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };
    verifyAuth();
  }, []);

  const login = (userData, accessToken, refreshToken) => {
    console.log("Login Called:", { userData, accessToken });
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    console.log("Logout Called");
    logoutUser();
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  };

  const refreshAccessToken = async () => {
    try {
      const newAccessToken = await refreshToken();
      setIsAuthenticated(true);
      return newAccessToken;
    } catch (error) {
      logout();
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, loading, refreshAccessToken }}
    >
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}