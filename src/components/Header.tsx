import React from "react";
// import { Link } from "react-router-dom";

// const Header: React.FC = () => {
//     return (
//         <header className="bg-gray-800 text-white px-6 py-4 shadow">
//             <div className="max-w-6xl mx-auto flex items-center justify-between">
//                 {/* Logo and Site Title */}
//                 <Link to="/" className="flex items-center space-x-2">
//                     <img
//                         src="/favicon-cart.jpg"
//                         alt="Logo"
//                         className="w-8 h-8"
//                     />
//                     <h1 className="text-2xl font-bold">E-Shop</h1>
//                 </Link>
//                 {/* Optional tagline or extra info */}
//                 <div className="hidden md:block">
//                     <p className="text-sm">Your one-stop shop for everything!</p>
//                 </div>
//             </div>
//         </header>
//     );
// };

interface HeaderProps {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
    className?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, actions, className = "" }) => {
    return (
        <div className={`mb-6 border-b pb-4 ${className}`}>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
                    {subtitle && (
                        <p className="text-gray-500 mt-1">{subtitle}</p>
                    )}
                </div>
                {actions && (
                    <div className="flex-shrink-0">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;