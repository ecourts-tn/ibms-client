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
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAuth = async () => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
        
        if (accessToken) {
            try {
                axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                const response = await api.get('auth/user/info/');
                setUser(response.data);
                setIsAuth(true);
                const storage = localStorage.getItem(ACCESS_TOKEN) ? localStorage : sessionStorage;
                storage.setItem("user", JSON.stringify(response.data));
            } catch (error) {
                console.error("Session verification failed:", error);
                logout();
            }
        }
        setLoading(false);
        };

        verifyAuth();
    }, []);

    const login = async (data, remember) => {
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem(ACCESS_TOKEN, data.access);
        storage.setItem(REFRESH_TOKEN, data.refresh);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
        try {
            const response = await api.get('auth/user/info/');
            const userData = response.data;
            const hasAdminRole = userData.roles.some(role => role.role_name === "Admin");
            setUser(userData);
            setIsAuth(true);
            storage.setItem("user", JSON.stringify(userData));
            // Redirect logic
            if (userData.role === 4 && !userData.is_complete) {
                navigate("/auth/profile");
            } else {
                if(hasAdminRole){
                    navigate('auth/users')
                }else{
                    navigate(userData.redirect_url || "/filing/dashboard");
                }
            }
        } catch (error) {
            console.error("Login failed:", error);
            logout();
        }
    };

    const hasDepartment = (departmentId) => {
        console.log("department id", departmentId)
        return user?.department === departmentId;
    };
        
    const hasAnyDepartment = (departmentIds = []) => {
        return user && departmentIds.includes(user.department);
    };
        
    const hasRole = (roleName) => {
        return user?.roles?.some(role => role.role_name === roleName);
    };
        
    const hasAnyRole = (roleNames = []) => {
        return user?.roles?.some(role => roleNames.includes(role.role_name));
    };
    

    const logout = () => {
        [localStorage, sessionStorage].forEach(storage => {
            storage.removeItem(ACCESS_TOKEN);
            storage.removeItem(REFRESH_TOKEN);
            storage.removeItem("user");
        });
        setIsAuth(false);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
        navigate("/");
    };

    const contextValue = useMemo(() => ({
        user,
        isAuth,
        loading,
        login,
        logout,
        hasRole,
        hasAnyRole,
        hasDepartment,
        hasAnyDepartment,
    }), [user, isAuth, loading]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};