import {XMarkIcon} from "@heroicons/react/24/outline";
import React, {Suspense, useEffect, useState} from "react";
// import Header from "./components/Header.tsx";
import './App.css';
import {setUnauthorizedHandler} from "./utils/apiClient.ts";
import Footer from "./components/Footer.tsx";
import CustomToaster from "./components/CustomToaster";
import {Link, Navigate, Route, Routes, useNavigate} from "react-router-dom";
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

    return (
            <>
                <div className="flex flex-col min-h-screen">
                <Navbar setAdminDrawerOpen={setIsAdminDrawerOpen}/>
                {/*<Navbar />*/}
                {/*<Header />*/}
                <CustomToaster />
                {/* Main content fills available space */}
                <main className="flex-grow flex items-center justify-center bg-gray-300  dark:bg-gray-700">
                    {/* Admin Drawer */}
                    {isAdminDrawerOpen && (
                        <div className="fixed inset-0 z-40 flex justify-end">
                            <div
                                className="absolute inset-0 bg-black opacity-50"
                                onClick={() => setIsAdminDrawerOpen(false)}
                            />
                            <div className="relative w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-6 shadow-lg z-50">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold">Admin Panel</h2>
                                    <button onClick={() => setIsAdminDrawerOpen(false)}>
                                        <XMarkIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                                    </button>
                                </div>
                                <nav className="space-y-3">
                                    <Link to="/admin/products" className="block hover:text-blue-500">Manage Products</Link>
                                    <Link to="/admin/users" className="block hover:text-blue-500">Manage Users</Link>
                                    <Link to="/admin/orders" className="block hover:text-blue-500">Manage Orders</Link>
                                    {/* Add more admin links if needed */}
                                </nav>
                            </div>
                        </div>
                    )}
                <ErrorBoundary fallback={<div>Something went wrong...! :/</div>}>
                    <Suspense fallback={<Loader />}>
                        <Routes>
                            {AuthRoutes()}
                            {PublicRoutes()}
                            {PrivateRoutes()}
                            {/* Redirect root '/' to '/login' */}
                            <Route path="/" element={<Navigate to="/login" replace />} />
                            {/* Catch-all redirects to '/login' */}
                            <Route path="*" element={<Navigate to="/login" replace />} />
                        </Routes>
                    </Suspense>
                </ErrorBoundary>
                </main>
                <Footer />
                </div>
            </>
    );
};

export default App;