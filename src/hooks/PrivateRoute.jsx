import { Navigate } from "react-router-dom";
import { AuthContext } from "contexts/AuthContext";
import { useContext } from "react";

export const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/" />;
  }
  return children;
};