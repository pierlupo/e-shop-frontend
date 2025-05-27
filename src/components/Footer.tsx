import React from "react";
import { Link } from "react-router-dom";
import {
    HomeIcon,
    InformationCircleIcon,
    PhoneIcon,
    ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-100 shadow py-6 mt-auto">
            <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                    <span className="font-bold text-lg">E-Shop</span> © {new Date().getFullYear()} All rights reserved.
                </div>
                <div className="flex space-x-4">
                    <Link to="/" className="flex items-center text-gray-700 hover:underline">
                        <HomeIcon className="h-4 w-4 mr-1" /> Home
                    </Link>
                    <Link to="/about" className="flex items-center text-gray-700 hover:underline">
                        <InformationCircleIcon className="h-4 w-4 mr-1" /> About
                    </Link>
                    <Link to="/contact" className="flex items-center text-gray-700 hover:underline">
                        <PhoneIcon className="h-4 w-4 mr-1" /> Contact
                    </Link>
                    <Link to="/privacy" className="flex items-center text-gray-700 hover:underline">
                        <ShieldCheckIcon className="h-4 w-4 mr-1" /> Privacy
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;