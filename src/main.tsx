import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import App from "./App";
import {AuthProvider} from "./components/auth/AuthProvider";
import '../index.css';

// React.StrictMode helps highlight potential problems in your app during development.
// BrowserRouter enables React Router in your app.
// AuthProvider provides authentication context (e.g., login state).
ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <ErrorBoundary fallback={<div>Oops! Something went wrong globally.</div>}>
                    <App />
                </ErrorBoundary>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);