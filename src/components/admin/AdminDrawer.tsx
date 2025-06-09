import React, {useEffect, useRef} from "react";
import {CubeIcon, UsersIcon, XMarkIcon, ShoppingBagIcon, ShieldCheckIcon} from "@heroicons/react/24/outline";
import {motion, AnimatePresence} from "framer-motion";
// import type FocusTrap from 'focus-trap-react';
import {Link} from "react-router-dom";
import useEscapeClose from "../../hooks/useEscapeClose";

type AdminDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
};

const drawerVariants = {
    hidden: {x: "-100%", opacity: 0},
    visible: {
        x: 0,
        opacity: 1,
        transition: {type: "spring", stiffness: 300, damping: 30}
    },
    exit: {x: "-100%", opacity: 0, transition: {duration: 0.2}}
};

const AdminDrawer: React.FC<AdminDrawerProps> = ({isOpen, onClose}) => {
    const drawerRef = useRef<HTMLDivElement>(null);
    useEscapeClose(onClose);

    useEffect(() => {
        if (isOpen && drawerRef.current) {
            drawerRef.current.focus();
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                // <FocusTrap>
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black bg-opacity-50 z-30"
                        initial={{opacity: 0}}
                        animate={{opacity: 0.5}}
                        exit={{opacity: 0}}
                        onClick={onClose}
                    />
                    {/* Drawer */}
                    <motion.aside
                        ref={drawerRef}
                        tabIndex={-1}
                        className="absolute left-0 top-0 h-full w-1/6 bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white p-6 shadow-lg z-40 border border-gray-300 dark:border-gray-700"
                        variants={drawerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{type: 'tween', duration: 0.3}}
                        aria-label="Admin drawer"
                    >
                        <div
                            className="flex justify-between items-center mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-bold flex items-center hover:underline"><ShieldCheckIcon
                                className="w-5 h-5 mr-3"/>Admin Panel</h2>
                            <button onClick={onClose}>
                                <XMarkIcon
                                    className="w-6 h-6 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"/>
                            </button>
                        </div>
                        <nav className="space-y-3">
                            <Link to="/admin/users" className="flex items-center hover:underline"><UsersIcon
                                className="w-5 h-5 mr-3"/><span className="font-semibold ">Users</span></Link>
                            <Link to="/admin/products" className="flex items-center hover:underline "><CubeIcon
                                className="w-5 h-5 mr-3"/><span className="font-semibold">Products</span></Link>
                            <Link to="/admin/orders" className="flex items-cente hover:underline r"><ShoppingBagIcon
                                className="w-5 h-5 mr-3"/><span className="font-semibold">Orders</span></Link>
                        </nav>
                    </motion.aside>
                </>
                // </FocusTrap>
            )}

        </AnimatePresence>

    );

};

export default AdminDrawer;