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
        <footer className="bg-gray-100 shadow py-6 mt-auto dark:bg-gray-600">
            <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                    <span className="font-bold text-lg text-gray-700 dark:text-amber-50">E-Shop</span><span className="text-gray-700 dark:text-amber-50"> © {new Date().getFullYear()} All rights reserved.</span>
                </div>
                <div className="flex space-x-4">
                    <Link to="/" className="flex items-center text-gray-700 hover:underline dark:text-amber-50">
                        <HomeIcon className="h-4 w-4 mr-1" /> Home
                    </Link>
                    <Link to="/about" className="flex items-center text-gray-700 hover:underline dark:text-amber-50">
                        <InformationCircleIcon className="h-4 w-4 mr-1" /> About
                    </Link>
                    <Link to="/contact" className="flex items-center text-gray-700 hover:underline dark:text-amber-50">
                        <PhoneIcon className="h-4 w-4 mr-1" /> Contact
                    </Link>
                    <Link to="/privacy" className="flex items-center text-gray-700 hover:underline dark:text-amber-50">
                        <ShieldCheckIcon className="h-4 w-4 mr-1" /> Privacy
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;