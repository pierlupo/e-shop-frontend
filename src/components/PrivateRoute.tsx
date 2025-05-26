import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";

interface PrivateRouteProps {
    children: React.ReactElement;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }

    return children;
};

export default PrivateRoute;