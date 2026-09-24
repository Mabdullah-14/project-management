import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../Context/authcontext';

const PublicRoutes = () => {
    const { user } = useAuth();

    

    return !user ? <Outlet /> : <Navigate to="/" replace />;
};

export default PublicRoutes;
