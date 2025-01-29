import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "contexts/AuthContext";
import { ToastContainer, toast } from "react-toastify";

export const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.error("Please login to access the page", {theme:"colored"});
      setTimeout(() => navigate("/"), 1000); // Redirect after showing toast
    }
  }, [user, navigate]);

  if (!user) return <ToastContainer />; // Prevent rendering protected content

  return children;
};
