import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "contexts/AuthContext";
import { ToastContainer, toast } from "react-toastify";

export const PrivateRoute = ({ children }) => {
  const { isAuth, user } = useContext(AuthContext); // Use isAuth and user from AuthContext
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the home page if the user is not authenticated
    if (!isAuth || !user) {
      toast.error("Please login to access the page", { theme: "colored" });
      setTimeout(() => navigate("/"), 100); // Redirect after showing toast
    }
  }, [isAuth, user, navigate]);

  // If the user is not authenticated, show only the ToastContainer
  if (!isAuth || !user) {
    return <ToastContainer />;
  }

  // Render the protected content if the user is authenticated
  return children;
};