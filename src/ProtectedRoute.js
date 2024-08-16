import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const userRole = localStorage.getItem('role');

    // Redirect to login if userRole is not set
    if (!userRole) {
        return <Navigate to="/login" />;
    }

    // Redirect to default route based on role if userRole doesn't match allowedRoles
    if (!allowedRoles.includes(userRole)) {
        if (userRole === 'admin') {
            return <Navigate to="/adminhome" />;
        } else {
            return <Navigate to="/" />
        }
    }

    // Allow access if the role matches
    return children;
};

export default ProtectedRoute;
