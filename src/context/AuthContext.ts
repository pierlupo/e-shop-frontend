import React, {createContext} from "react";
import type {User} from "../interfaces/User.ts";

export interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);