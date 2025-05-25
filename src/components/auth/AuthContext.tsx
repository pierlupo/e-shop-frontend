import React, { createContext, useState, useContext, useEffect } from "react";
import {userService} from "../../services/UserService.ts";
import type { User } from "../../interfaces/User.ts";

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem("token"));
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) as User : null;
    });

    // Fetch fresh user info on mount if token exists
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && user?.id) {
            userService.getUserById(user.id)
                .then(freshUser => {
                    setUser(freshUser);
                    localStorage.setItem("user", JSON.stringify(freshUser));
                })
                .catch(() => {
                    // Token invalid or user not found, logout
                    logout();
                });
        }
    }, [user?.id]);

    const login = (token: string, user: User) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setIsAuthenticated(true);
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};