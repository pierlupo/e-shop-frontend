import React from "react";

interface LayoutWrapperProps {
    children: React.ReactNode;
    className?: string;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children, className = "" }) => {
    return (
        <div className={`max-w-3xl w-full mx-auto mt-10 mb-10 p-6 bg-gray-100 rounded shadow ${className}`}>
            {children}
        </div>
    );
};

export default LayoutWrapper;
