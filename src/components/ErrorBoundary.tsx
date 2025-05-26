import React, { Component } from "react";
import type { ReactNode } from "react";

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

/**
 * ErrorBoundary is a React class component that catches JavaScript errors
 * anywhere in its child component tree, logs those errors, and displays a fallback UI
 * instead of the component tree that crashed.
 *
 * Usage:
 * Wrap parts of your app with <ErrorBoundary> to prevent the entire app from crashing.
 * When an error happens inside the wrapped children, the fallback UI is shown.
 */

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }
// This lifecycle method is called when a child component throws an error.
    static getDerivedStateFromError(_: Error): ErrorBoundaryState {
        // Update state to display fallback UI on next render
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // You can log error to an error reporting service here
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Render fallback UI, either passed as prop or default
            return this.props.fallback || (
                <div>
                    <h2>Something went wrong.</h2>
                    <p>Please try refreshing the page.</p>
                </div>
            );
        }
        // Render children if no error
        return this.props.children;
    }
}

export default ErrorBoundary;