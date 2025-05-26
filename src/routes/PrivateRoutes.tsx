import { lazy } from "react";
import { Route } from "react-router-dom";
import Profile from "../components/Profile.tsx";
import Home from "../components/Home.tsx";
import PrivateRoute from "../components/PrivateRoute";

const Dashboard = lazy(() => import("../components/Dashboard"));

const PrivateRoutes = () => (
    <>
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>}/>
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}/>
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>}/>
    </>
);

export default PrivateRoutes;