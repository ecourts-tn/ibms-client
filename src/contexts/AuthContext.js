import api from "api";
import axios from "axios";
import { createContext, useContext, useMemo, useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "hooks/useLocalStorage";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "constants";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const [isAuth, setIsAuth] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const sessionUser = sessionStorage.getItem("user");
    const accessToken = sessionStorage.getItem("ACCESS_TOKEN");

    if (accessToken && sessionUser) {
      setIsAuth(true);
      setUser(JSON.parse(sessionUser));
    } 
    // else {
    //   setIsAuth(false);
    //   setUser(null);
    // }
  }, []);

  const login = async (data) => {
    if (!data) return;
    sessionStorage.clear();
    sessionStorage.setItem(ACCESS_TOKEN, data.access);
    sessionStorage.setItem(REFRESH_TOKEN, data.refresh);
    setIsAuth(true)
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;

    try {
        const response = await api.post(`auth/user/info/`);
        if (response.status === 200) {
            setUser(response.data);
            setTimeout(() => {
                navigate(response.data.redirect_url);
            }, 1000);
        }
    } catch (error) {
        console.error("Failed to fetch user info:", error);
        setUser(null);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("access");
    sessionStorage.removeItem("refresh");
    sessionStorage.removeItem("user");
    setIsAuth(false)
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    navigate("/");
  };

  const contextValue = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuth,
      setUser,
      setIsAuth
    }),
    [user]
  );
  return (
    <AuthContext.Provider value={contextValue}>
        {children}
    </AuthContext.Provider>
)
};

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

