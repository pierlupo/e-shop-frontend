import {useContext} from "react";
import {AuthContext, type AuthContextType} from "./AuthContext";

export const useAuth = () => {
    const context:AuthContextType|undefined = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};