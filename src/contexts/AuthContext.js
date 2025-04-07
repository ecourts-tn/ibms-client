import { createContext, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "hooks/useLocalStorage";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "constants";
import axios from "axios";
import api from "api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();

  // Check authentication state on initial load
  useEffect(() => {
    console.log("AuthProvider useEffect triggered");
    const accessToken = localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
    const sessionUser = localStorage.getItem("user") || sessionStorage.getItem("user");

    if (accessToken && sessionUser) {
      console.log("User is authenticated. Setting auth state...");
      setIsAuth(true);
      setUser(JSON.parse(sessionUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } else {
      console.log("User is not authenticated.");
      setIsAuth(false);  // Explicitly set isAuth to false if no valid token or user
    }
  }, []);

  const login = async (data, remember) => {
    if (!data) return;

    console.log("Logging in...");

    // Store tokens and user info
    if (remember) {
      localStorage.setItem(ACCESS_TOKEN, data.access);
      localStorage.setItem(REFRESH_TOKEN, data.refresh);
    } else {
      sessionStorage.setItem(ACCESS_TOKEN, data.access);
      sessionStorage.setItem(REFRESH_TOKEN, data.refresh);
    }

    // Set authorization header
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;

    // Fetch user info
    try {
      const response = await api.get(`auth/user/info/`);
      if (response.status === 200) {
        console.log("User info fetched successfully:", response.data);
        setUser(response.data);
        setIsAuth(true);

        // Store user info in local/session storage based on 'remember' flag
        if (remember) {
          localStorage.setItem("user", JSON.stringify(response.data));
        } else {
          sessionStorage.setItem("user", JSON.stringify(response.data));
        }

        // Redirect after login
        console.log("Redirecting to:", response.data.redirect_url);
        setTimeout(() => {
          navigate(response.data.redirect_url || "/"); // Default to / if no redirect_url
        }, 1000);
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      setUser(null);
      setIsAuth(false);
    }
  };

  const logout = () => {
    console.log("Logging out...");
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem("user");
    sessionStorage.clear();
    setIsAuth(false);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    navigate("/");
  };

  const contextValue = useMemo(
    () => ({
      user,
      isAuth,
      login,
      logout,
      setUser,
      setIsAuth,
    }),
    [user, isAuth]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
