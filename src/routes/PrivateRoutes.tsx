import {lazy} from "react";
import {Route} from "react-router-dom";
import OrderManager from "../components/admin/OrderManager.tsx";
import ProductManager from "../components/admin/ProductManager.tsx";
import RequireAdmin from "../components/admin/RequireAdmin.tsx";
import UserManager from "../components/admin/UserManager.tsx";
import Home from "../components/Home.tsx";
import PrivateRoute from "../components/PrivateRoute";
import Profile from "../components/Profile.tsx";

const Dashboard = lazy(() => import("../components/Dashboard"));

const PrivateRoutes = () => (
     <>
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>}/>
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}/>
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>}/>

        <Route path="/admin/users" element={<RequireAdmin><UserManager /></RequireAdmin>} />
        <Route path="/admin/products" element={<RequireAdmin><ProductManager /></RequireAdmin>} />
        <Route path="/admin/orders" element={<RequireAdmin><OrderManager /></RequireAdmin>} />
    </>
);

export default PrivateRoutes;