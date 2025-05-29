import apiClient from "../utils/apiClient.ts";
import { AUTH_API_URL } from "../config/config";
import type {LoginRequest, LoginResponse, SignupRequest, SignupResponse} from "../interfaces/Auth";


export const login = async (credentials: LoginRequest) => {
    const response = await apiClient.post<LoginResponse>(`${AUTH_API_URL}/login`, credentials);
    return response.data;
};


export const signup = async (data: SignupRequest) => {
    const response = await apiClient.post<SignupResponse>(`${AUTH_API_URL}/signup`, data);
    return response.data;
};


export const validateToken = async () => {
    try {
        const token:string|null = localStorage.getItem('token');
        if (!token) return false;
        const response = await apiClient.get(`${AUTH_API_URL}/validate`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.status === 200;
    } catch (err) {
        console.error('Token validation failed:', err);
        return false;
    }
};