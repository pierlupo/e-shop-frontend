import React from "react";
import { Toaster } from "react-hot-toast";

const CustomToaster: React.FC = () => {

    return (
        <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
                // Global default styles
                style: {
                    minHeight: "100px",
                    minWidth: "300px",
                    borderRadius: "10px",
                    background: "#1a202c",  // dark slate
                    color: "#f7fafc",       // light text
                    fontSize: "20px",
                    fontFamily:"'Inter', sans-serif",
                    fontWeight: "400",
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