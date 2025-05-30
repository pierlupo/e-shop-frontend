import React, {Suspense, useEffect} from "react";
// import Header from "./components/Header.tsx";
import './App.css';
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

    const navigate = useNavigate();

    useEffect(() => {
        setUnauthorizedHandler(() => {
            navigate('/login');
        });
    }, [navigate]);

    return (
            <>
                <div className="flex flex-col min-h-screen">
                <Navbar />
                {/*<Header />*/}
                <CustomToaster />
                {/* Main content fills available space */}
                <main className="flex-grow flex items-center justify-center dark:bg-gray-700">
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