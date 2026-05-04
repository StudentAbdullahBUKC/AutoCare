import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, roleRequired }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roleRequired && user.role !== roleRequired) {
        return <Navigate to="/" replace />; // Or to a 'Not Authorized' page
    }

    return children;
};

export default ProtectedRoute;
