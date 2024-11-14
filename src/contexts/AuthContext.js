import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "hooks/useLocalStorage";
import api from "api";
import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "constants";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

  // const login = async (data) => {
  //   if(data){
  //       sessionStorage.clear()
  //       sessionStorage.setItem(ACCESS_TOKEN, data.access);
  //       sessionStorage.setItem(REFRESH_TOKEN, data.refresh);
  //       axios.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
  //       try{
  //           const response = await api.post(`auth/user/info/`)
  //           if(response.status === 200){
  //             setUser(response.data)
  //           setTimeout(() => {
  //               const usertype = parseInt(user.user_type)
  //               if(usertype === 1 || usertype === 2){
  //                 navigate("/dashboard")
  //               }else if(usertype === 3){
  //                 navigate('/ibms/prosecution/dashboard')
  //               }else if(usertype === 4){
  //                 navigate('/ibms/prison/dashboard')
  //               }else if(usertype === 5){
  //                 navigate('/ibms/police/dashboard')
  //               }else if(usertype === 6 || usertype === 8){
  //                 navigate("/ibms/court/dashboard");
  //               }
  //           },1000)
  //           }
  //       }catch(error){
  //           setUser(null)
  //       }
  //   }
    
  // };

  const login = async (data) => {
    if (!data) return;

    sessionStorage.clear();
    sessionStorage.setItem(ACCESS_TOKEN, data.access);
    sessionStorage.setItem(REFRESH_TOKEN, data.refresh);

    // Set the Authorization header globally for axios
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;

    try {
        const response = await api.post(`auth/user/info/`);
        if (response.status === 200) {
            setUser(response.data);

            const userTypeRoutes = {
                1: "/dashboard",
                2: "/dashboard",
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

    // Clear Authorization header
    delete axios.defaults.headers.common['Authorization'];

    // Reset user state
    setUser(null);

    // Navigate to the home page
    navigate("/", { replace: true });
  };


  // const logout = () => {
  //   sessionStorage.removeItem("access")
  //   sessionStorage.removeItem("refresh")
  //   sessionStorage.removeItem("user")
  //   setUser(null);
  //   navigate("/", {replace: true });
  // };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};