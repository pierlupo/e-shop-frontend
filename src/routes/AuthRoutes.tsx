import React, { lazy } from "react";
import { Route } from "react-router-dom";

const Login = lazy(() => import("../components/auth/Login"));
const Signup = lazy(() => import("../components/auth/Signup"));

const AuthRoutes = (): React.ReactElement => (
    <>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
    </>
);

export default AuthRoutes;