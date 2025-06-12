import { ShieldCheckIcon, UserIcon } from "@heroicons/react/24/outline";
import type {ReactElement} from "react";


export const getRoleColor = (role: string): string => {
    const normalized = role.toLowerCase().replace("role_", "");
    const baseStyleAdmin = "bg-red-500 inline-flex items-center justify-center px-3 min-w-[80px] py-1 rounded-full text-xs font-semibold text-amber-50"
    const baseStyleUser = "bg-blue-500 inline-flex items-center justify-center px-3 min-w-[80px] py-1 rounded-full text-xs font-semibold text-amber-50"
    const baseStyleDefault = "bg-gray-400 inline-flex items-center justify-center px-3 min-w-[80px] py-1 rounded-full text-xs  font-semibold text-amber-50"
    switch (normalized) {
        case "admin":
            return `${baseStyleAdmin}`;
        case "user":
            return `${baseStyleUser}`;
        default:
            return `${baseStyleDefault}`;
    }
};

export const getRoleIcon = (role: string): ReactElement | null => {
    switch (role.toLowerCase()) {
        case "admin":
            return <ShieldCheckIcon className="h-4 w-4 mr-1" />;
        case "user":
            return <UserIcon className="h-4 w-4 mr-1" />;
        default:
            return null;
    }
};