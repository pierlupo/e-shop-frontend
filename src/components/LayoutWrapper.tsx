import React from "react";

interface LayoutWrapperProps {
    children: React.ReactNode;
    className?: string;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children, className = "" }) => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className={`max-w-3xl w-full mx-auto p-6 bg-gray-100 rounded shadow ${className}`}>
                {children}
            </div>
        </div>
    );
};

export default LayoutWrapper;
