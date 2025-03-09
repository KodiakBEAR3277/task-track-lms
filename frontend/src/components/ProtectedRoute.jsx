import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const userRole = JSON.parse(atob(token.split('.')[1])).role;
    
    if (!token) {
        return <Navigate to="/login" />;
    }
    
    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" />;
    }
    
    return children;
};