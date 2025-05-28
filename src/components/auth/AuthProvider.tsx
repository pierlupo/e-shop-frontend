import React, {useState, useEffect} from "react";
import {userService} from "../../services/UserService";
import {AuthContext} from "../../context/AuthContext.ts";
import type {User} from "../../interfaces/User";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem("token"));
    const [user, setUser] = useState<User | null>(() => {
        const storedUser:string|null = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) as User : null;
    });

    useEffect(() => {
        const token:string|null = localStorage.getItem("token");
        if (token && user?.id) {
            userService.getUserById(user.id)
                .then(freshUser => {
                    setUser(freshUser);
                    localStorage.setItem("user", JSON.stringify(freshUser));
                })
                .catch(() => logout());
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
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};