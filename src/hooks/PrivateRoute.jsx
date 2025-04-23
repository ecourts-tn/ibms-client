import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "contexts/AuthContext";
import Loading from "components/utils/Loading";

export const PrivateRoute = ({ children }) => {
    const { isAuth, user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <Loading />;
    }

    // Allow access to profile page even if not complete
    const isProfileRoute = location.pathname.includes('/auth/profile');
    const isAllowedRoute = !isAuth || (user?.role === 4 && !user?.is_complete && isProfileRoute);

    if (!isAuth) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    // Redirect to profile if incomplete (except when already on profile page)
    if (user?.role === 4 && !user?.is_complete && !isProfileRoute) {
        return <Navigate to="/auth/profile" replace />;
    }

    return children;
};