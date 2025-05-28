import React from "react";

interface LayoutWrapperProps {
    children: React.ReactNode;
    className?: string;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children, className = "" }) => {
    return (
        <div className="flex items-center justify-center bg-gray-50 w-full max-w-2xl">
            <div className={`w-full max-w-2xl p-6  rounded shadow ${className}`}>
                {children}
            </div>
        </div>
    );
};

export default LayoutWrapper;