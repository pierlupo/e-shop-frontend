import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {DarkModeProvider} from "./providers/DarkModeProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import App from "./App";
import {AuthProvider} from "./providers/AuthProvider";
import './i18n';
import '../index.css';

// React.StrictMode helps highlight potential problems in your app during development.
// BrowserRouter enables React Router in your app.
// AuthProvider provides authentication context (e.g., login state).
ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <DarkModeProvider>
        <BrowserRouter>
            <AuthProvider>
                <ErrorBoundary fallback={<div>Oops! Something went wrong globally.</div>}>
                    <App />
                </ErrorBoundary>
            </AuthProvider>
        </BrowserRouter>
        </DarkModeProvider>
    </React.StrictMode>
);