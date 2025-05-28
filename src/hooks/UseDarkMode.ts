import {useContext} from "react";
import {DarkModeContext, type DarkModeContextType} from "../context/DarkModeContext.ts";

export const useDarkMode = (): DarkModeContextType => {
    const context = useContext(DarkModeContext);
    if (!context) throw new Error('useDarkMode must be used within a DarkModeProvider');
    return context;
};