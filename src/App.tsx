import React, {Suspense, useEffect, useState} from "react";
import './App.css';
import {Navigate, Route, Routes, useNavigate} from "react-router-dom";
import AdminDrawer from "./components/admin/AdminDrawer.tsx";
import CustomToaster from "./components/CustomToaster";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import Footer from "./components/Footer.tsx";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar.tsx";
import AuthRoutes from "./routes/AuthRoutes.tsx";
import PrivateRoutes from "./routes/PrivateRoutes";
import PublicRoutes from "./routes/PublicRoutes";
import {setUnauthorizedHandler} from "./utils/apiClient.ts";


const App: React.FC = () => {

    const navigate = useNavigate();
    const [isAdminDrawerOpen, setIsAdminDrawerOpen] = useState(false);

    useEffect(() => {
        setUnauthorizedHandler(() => {
            navigate('/login');
        });
    }, [navigate]);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar isAdminDrawerOpen={isAdminDrawerOpen} setAdminDrawerOpen={setIsAdminDrawerOpen} />
            <CustomToaster />
            <main className="flex-grow flex relative bg-gray-300 dark:bg-gray-700 overflow-hidden">
                <AdminDrawer isOpen={isAdminDrawerOpen} onClose={() => setIsAdminDrawerOpen(false)} />
                {/* Page Content */}
                <div className="flex-grow flex items-center justify-center z-10">
                    <ErrorBoundary fallback={<div>Something went wrong...! :/</div>}>
                        <Suspense fallback={<Loader />}>
                            <Routes>
                                {AuthRoutes()}
                                {PublicRoutes()}
                                {PrivateRoutes()}
                                <Route path="/" element={<Navigate to="/login" replace />} />
                                <Route path="*" element={<Navigate to="/login" replace />} />
                            </Routes>
                        </Suspense>
                    </ErrorBoundary>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default App;