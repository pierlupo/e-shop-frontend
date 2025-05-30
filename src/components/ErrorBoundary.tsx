import React, { Component, type ReactNode } from "react";
import { withTranslation, type WithTranslation } from "react-i18next";

interface ErrorBoundaryProps extends WithTranslation {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        const { t } = this.props;

        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="p-4 text-center">
                    <h2 className="text-lg font-bold text-red-600">{t('error_boundary_msg')}</h2>
                    <p className="text-sm text-gray-600">{t('error_boundary_instruction') || "Please try refreshing the page."}</p>
                </div>
            );
        }

        return this.props.children;
    }
}

const TranslatedErrorBoundary = withTranslation()(ErrorBoundary);
export default TranslatedErrorBoundary;