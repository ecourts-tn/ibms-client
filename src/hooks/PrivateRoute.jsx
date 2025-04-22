
import { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "contexts/AuthContext";
import api from "api";


export const PrivateRoute = ({ children }) => {
  const { isAuth, user } = useContext(AuthContext);
  const [shouldRedirect, setShouldRedirect] = useState(false)

  useEffect(() => {
    const checkProfile = async() => {
      try {
        const response = await api.get("/auth/user/profile/check-complete/")
        const { role, is_complete} = response.data
        if (role === "advocate" && !is_complete) {
          setShouldRedirect(true);
        }
      }catch(error){
        console.log(error)
      }
    }
    checkProfile()
  },[]);

  if(shouldRedirect){
    return <Navigate to="profile" replace/>
  }

  if (!user || !isAuth) {
    // user is not authenticated
    return <Navigate to="/" replace />
  }
  return children;
};