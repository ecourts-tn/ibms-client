import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "contexts/AuthContext";

const RoleRoute = ({ allowedDepartments = [], allowedRoles = [], children }) => {
    const { user, isAuth, loading, hasAnyDepartment, hasAnyRole } = useContext(AuthContext);

    useEffect(() => {
        console.log("=== RoleRoute Debug ===");
        console.log("User:", user);
        console.log("Allowed Departments:", allowedDepartments);
        console.log("Allowed Roles:", allowedRoles);
        console.log("User Department:", user?.department);
        console.log("User Roles:", user?.roles?.map(r => r.role_name));
        console.log("Access Allowed:", hasAnyDepartment(allowedDepartments), hasAnyRole(allowedRoles));
        console.log("========================");
      }, [user]);
      
    if (loading) return <div>Loading...</div>;

    

    const hasAccess =
        (allowedDepartments.length === 0 || hasAnyDepartment(allowedDepartments)) &&
        (allowedRoles.length === 0 || hasAnyRole(allowedRoles));

    if (!isAuth || !hasAccess) {
        return <Navigate to="/" />;
    }

    return children;
};

export default RoleRoute;
