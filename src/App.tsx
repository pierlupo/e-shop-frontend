import React, { Suspense} from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import AuthRoutes from "./routes/AuthRoutes.tsx";
import PublicRoutes from "./routes/PublicRoutes";
import PrivateRoutes from "./routes/PrivateRoutes";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import Navbar from "./components/Navbar.tsx";


const App: React.FC = () => {
    return (
            <>
                <Navbar />
                <ErrorBoundary fallback={<div>Oops! Something went wrong.</div>}>
                    <Suspense fallback={<div>Loading...</div>}>
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
            </>
    );
};
export default App;