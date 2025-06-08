import React, {Suspense, useEffect, useState} from "react";
// import Header from "./components/Header.tsx";
import './App.css';
import AdminDrawer from "./components/admin/AdminDrawer.tsx";
import {setUnauthorizedHandler} from "./utils/apiClient.ts";
import Footer from "./components/Footer.tsx";
import CustomToaster from "./components/CustomToaster";
import {Navigate, Route, Routes, useNavigate} from "react-router-dom";
import AuthRoutes from "./routes/AuthRoutes.tsx";
import PublicRoutes from "./routes/PublicRoutes";
import PrivateRoutes from "./routes/PrivateRoutes";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import Navbar from "./components/Navbar.tsx";
import Loader from "./components/Loader";


const App: React.FC = () => {
    // const location = useLocation();
    // const isAdminRoute = location.pathname.startsWith("/admin");
    const navigate = useNavigate();
    const [isAdminDrawerOpen, setIsAdminDrawerOpen] = useState(false);

    useEffect(() => {
        setUnauthorizedHandler(() => {
            navigate('/login');
        });
    }, [navigate]);

    // ESC key to close drawer
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsAdminDrawerOpen(false);
        };
        if (isAdminDrawerOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isAdminDrawerOpen]);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar setAdminDrawerOpen={setIsAdminDrawerOpen} />
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