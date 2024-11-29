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
  // const [isAuth, setIsAuth] = useState(false);
  // const [user, setUser] = useState(null);

  useEffect(() => {
    const sessionUser = sessionStorage.getItem("user");
    const accessToken = sessionStorage.getItem("ACCESS_TOKEN");

    if (accessToken && sessionUser) {
      setIsAuth(true);
      setUser(JSON.parse(sessionUser));
    } else {
      setIsAuth(false);
      setUser(null);
    }
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

            const userTypeRoutes = {
                1: "/filing/dashboard",
                2: "/filing/dashboard",
                3: "/prosecution/dashboard",
                4: "/prison/dashboard",
                5: "/police/dashboard",
                6: "/court/dashboard",
                8: "/court/dashboard",
            };

            const usertype = parseInt(response.data.user_type, 10);
            const route = userTypeRoutes[usertype];

            if (route) {
                setTimeout(() => {
                    navigate(route);
                }, 1000);
            } else {
                console.warn("Unknown user type:", usertype);
            }
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

  // const contextValue = useMemo(
  //   () => ({
  //     user,
  //     login,
  //     logout,
  //     isAuth
  //   }),
  //   [user]
  // );
  return (
    <AuthContext.Provider value={{ isAuth, user, setIsAuth, setUser, login, logout }}>
        {children}
    </AuthContext.Provider>
)
};

// export const useAuth = () => {
//   return useContext(AuthContext);
// };