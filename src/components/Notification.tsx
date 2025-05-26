import {JSX} from "react";

type NotificationProps = {
    message: string;
    type?: "success" | "error" | "info";
};

const baseStyles = "fixed top-5 right-5 px-4 py-2 rounded shadow-md text-white z-50 transition-opacity duration-300";

const typeStyles = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
};

const Notification: ({message, type}: { message: any; type?: any }) => JSX.Element = ({ message, type = "info" }) => {
    return <div className={`${baseStyles} ${typeStyles[type]}`}>{message}</div>;
};

export default Notification;