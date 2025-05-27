import React, { Suspense} from "react";
// import Header from "./components/Header.tsx";
import './App.css';
import Footer from "./components/Footer.tsx";
import CustomToaster from "./components/CustomToaster";
import {Navigate, Route, Routes} from "react-router-dom";
import AuthRoutes from "./routes/AuthRoutes.tsx";
import PublicRoutes from "./routes/PublicRoutes";
import PrivateRoutes from "./routes/PrivateRoutes";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import Navbar from "./components/Navbar.tsx";
import Loader from "./components/Loader";


const App: React.FC = () => {
    return (
            <>
                <div className="flex flex-col min-h-screen">
                <Navbar />
                {/*<Header />*/}
                <CustomToaster />
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
                <Footer />
                </div>
            </>
    );
};
export default App;