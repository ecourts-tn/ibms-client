import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

export const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    // user is not authenticated
    return <Navigate to="/auth/login" />;
  }
  return children;
};