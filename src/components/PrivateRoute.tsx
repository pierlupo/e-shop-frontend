import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";

interface PrivateRouteProps {
    children: React.ReactElement; // React.ReactElement is more idiomatic than JSX.Element here
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }

    return children;
};

export default PrivateRoute;