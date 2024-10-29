import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import api from "api";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = async (token) => {
    if(token){
      try{
        const response = await api.post(`auth/user/info/`)
        if(response.status === 200){
          setUser(response.data)
          setTimeout(() => {
            navigate("/dashboard");
          },1000)
        }
      }catch(error){
        setUser(null)
      }
    }
    
  };

  // call this function to sign out logged in user
  const logout = () => {
    sessionStorage.removeItem("access")
    sessionStorage.removeItem("refresh")
    sessionStorage.removeItem("user")
    setUser(null);
    navigate("/auth/login", {replace: true });
  };

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