import React from "react";
import { Toaster } from "react-hot-toast";

const CustomToaster: React.FC = () => {
    return (
        <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
                // Global default styles for all toasts
                style: {
                    borderRadius: "8px",
                    background: "#1a202c",  // dark slate
                    color: "#f7fafc",       // light text
                    fontWeight: "600",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
                },
                // Customized success toast
                success: {
                    iconTheme: {
                        primary: "#48bb78",
                        secondary: "#f0fff4",
                    },
                    style: {
                        background: "#2f855a",
                        color: "#e6fffa",
                    },
                },
                // Customized error toast
                error: {
                    iconTheme: {
                        primary: "#f56565",
                        secondary: "#fff5f5",
                    },
                    style: {
                        background: "#c53030",
                        color: "#fff5f5",
                    },
                },
            }}
        />
    );
};

export default CustomToaster;