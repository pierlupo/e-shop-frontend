import {HomeIcon} from "@heroicons/react/24/outline";
import React, {useState} from "react";
import {toast} from "react-hot-toast";
import {useTranslation} from "react-i18next";
import {Link, useNavigate} from "react-router-dom";
import {LanguageDropdown} from "./LanguageDropDown.tsx";

import {useAuth} from "../hooks/UseAuth.ts";
import {Squares2X2Icon, UserIcon, UserPlusIcon, Bars3Icon, XMarkIcon, MoonIcon, SunIcon} from "@heroicons/react/24/outline";
import ConfirmationDialog from "./ConfirmationDialog";
import { useDarkMode } from '../hooks/UseDarkMode';


const Navbar: React.FC = () => {
    const {isAuthenticated, logout, user} = useAuth();
    const navigate = useNavigate();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const {isDarkMode: darkMode, toggleDarkMode: setDarkMode} = useDarkMode();
    const {t} = useTranslation();

    const handleLogout = () => {
        logout();
        toast.success(`See you next time ${user?.firstname || "user"}`);
        navigate("/login");
    };

    return (
        <>
            <nav className="bg-gray-100 dark:bg-gray-600 shadow">
                <div className="mx-auto px-6">
                    {/* Flex container for nav items */}
                    <div className="flex items-center justify-between py-4">
                        {/* Left: Logo and Title */}
                        <Link to="/home" className="flex items-center space-x-2">
                            <img src="/favicon-cart.jpg" alt="Logo" className="w-8 h-8" />
                            <span className="font-bold text-xl text-gray-800 dark:text-amber-50">{t('title')}</span>
                        </Link>
                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-4">
                            {isAuthenticated && user && (
                                <Link to="/profile" className="relative group flex items-center space-x-2 text-gray-700 dark:text-amber-50">
                                    {user.avatarUrl ? (
                                        <img
                                            src={`${import.meta.env.VITE_API_BASE_URL}${user.avatarUrl}`}
                                            alt="User Avatar"
                                            className="w-8 h-8 rounded-full border border-gray-300 shadow-sm object-cover hover:ring-2 hover:ring-gray-500 transition"
                                        />
                                    ) : (
                                        <UserIcon className="w-6 h-6 hover:text-gray-900 transition duration-150" />
                                    )}
                                    <span className="hidden sm:inline">Welcome {user.firstname} !</span>
                                    <span className="absolute -bottom-10 transform -translate-x-1/2 scale-0 group-hover:scale-100
             bg-gray-800 text-amber-50 text-sm px-2 py-1 rounded shadow
             transition-all duration-200 whitespace-nowrap z-10">
                                        {t('tooltip_profile')}
                                    </span>
                                </Link>
                            )}
                            {isAuthenticated ? (
                                <>
                                    <Link to="/home" className="flex items-center text-gray-700 hover:underline dark:text-amber-50">
                                        <HomeIcon className="h-4 w-4 mr-1" /> {t('home_link')}
                                    </Link>
                                    <Link to="/dashboard" className="flex items-center text-gray-700 hover:underline dark:text-amber-50">
                                        <Squares2X2Icon className="h-4 w-4 mr-1" /> {t('dash_link')}
                                    </Link>
                                    <button
                                        onClick={() => setDarkMode()}
                                        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                                        title="Toggle dark mode"
                                    >
                                        {darkMode ? <SunIcon className="w-5 h-5 text-yellow-500" /> : <MoonIcon className="w-5 h-5 text-gray-700" />}
                                    </button>
                                    <LanguageDropdown />
                                    <button
                                        onClick={() => setShowLogoutConfirm(true)}
                                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        {t('logout_btn')}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="flex items-center text-gray-700 hover:underline dark:text-amber-50">
                                        <UserIcon className="h-4 w-4 mr-1" /> {t('login_link_nav')}
                                    </Link>
                                    <Link to="/signup" className="flex items-center text-gray-700 hover:underline dark:text-amber-50">
                                        <UserPlusIcon className="h-4 w-4 mr-1" /> {t('signup_link_nav')}
                                    </Link>
                                    <button
                                        onClick={() => setDarkMode()}
                                        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                                        title="Toggle dark mode"
                                    >
                                        {darkMode ? <SunIcon className="w-5 h-5 text-yellow-500" /> : <MoonIcon className="w-5 h-5 text-gray-700" />}
                                    </button>
                                    <LanguageDropdown />
                                </>
                            )}
                        </div>
                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
                                {isOpen ? (
                                    <XMarkIcon className="w-6 h-6 text-gray-700" />
                                ) : (
                                    <Bars3Icon className="w-6 h-6 text-gray-700" />
                                )}
                            </button>
                        </div>
                    </div>
                    {/* Mobile Dropdown Menu */}
                    {isOpen && (
                        <div className="md:hidden pb-4 space-y-2">
                            {isAuthenticated && user && (
                                <Link to="/profile" className="flex items-center space-x-2 text-gray-700">
                                    {user.avatarUrl ? (
                                        <img
                                            src={`${import.meta.env.VITE_API_BASE_URL}${user.avatarUrl}`}
                                            alt="User Avatar"
                                            className="w-8 h-8 rounded-full border border-gray-300 shadow-sm object-cover"
                                        />
                                    ) : (
                                        <UserIcon className="w-6 h-6" />
                                    )}
                                    <span>Welcome {user.firstname} !</span>
                                </Link>
                            )}
                            {isAuthenticated ? (
                                <>
                                    <Link to="/home" className="flex items-center text-gray-700 hover:underline">
                                        <HomeIcon className="h-4 w-4 mr-1" /> {t('home_link')}
                                    </Link>
                                    <Link to="/dashboard" className="flex items-center text-gray-700 hover:underline">
                                        <Squares2X2Icon className="h-4 w-4 mr-1" /> {t('dash_link')}
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setShowLogoutConfirm(true);
                                            setIsOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        Logout
                                    </button>
                                    <button
                                        onClick={() => setDarkMode()}
                                        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                                        title="Toggle dark mode"
                                    >
                                        {darkMode ? <SunIcon className="w-5 h-5 text-yellow-500" /> : <MoonIcon className="w-5 h-5 text-gray-700" />}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="flex items-center text-gray-700 hover:underline">
                                        <UserIcon className="h-4 w-4 mr-1" /> {t('login_link_nav')}
                                    </Link>
                                    <Link to="/signup" className="flex items-center text-gray-700 hover:underline">
                                        <UserPlusIcon className="h-4 w-4 mr-1" /> {t('signup_link_nav')}
                                    </Link>
                                    <button
                                        onClick={() => setDarkMode()}
                                        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                                        title="Toggle dark mode"
                                    >
                                        {darkMode ? <SunIcon className="w-5 h-5 text-yellow-500" /> : <MoonIcon className="w-5 h-5 text-gray-700" />}
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </nav>
            {/* Logout Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={showLogoutConfirm}
                title="Confirm Logout"
                message="Are you sure you want to log out ?"
                onConfirm={() => {
                    setShowLogoutConfirm(false);
                    handleLogout();
                }}
                onCancel={() => setShowLogoutConfirm(false)}
            />
        </>
    );
};

export default Navbar;