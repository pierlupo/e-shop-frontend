import toast from "react-hot-toast";

export const toastInfo = (message: string) =>
    toast(message, {
        icon: "ℹ️",
        style: {
            background: "#2b6cb0",
            color: "#ebf8ff",
            borderRadius: "8px",
            fontWeight: "600",
            boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
        },
    });

export const toastWarn = (message: string) =>
    toast(message, {
        icon: "ℹ️",
        style: {
            background: "rgba(241,231,42,0.97)",
            color: "#ebf8ff",
            borderRadius: "8px",
            fontWeight: "600",
            boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
        },
    });