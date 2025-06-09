import React from "react";
import {Navigate} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth.ts";


const RequireAdmin = ({children}: { children: React.ReactElement }) => {

    const {user} = useAuth();

    const isAdmin = user?.roles?.some(role => role.name === "ROLE_ADMIN");
    if (!isAdmin) {
        return <Navigate to="/unauthorized" replace/>;
    }
    return children;
};

export default RequireAdmin