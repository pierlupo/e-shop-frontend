import type {User} from "./User.ts";

export interface LoginResponse {
    message: string;
    data: {
        user: User;
        userId: number;
        token: string;
    };
}

export interface SignupResponse {
    message: string;
    data: {
        id: number;
        token: string;
    };
}

export interface SignupRequest {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}