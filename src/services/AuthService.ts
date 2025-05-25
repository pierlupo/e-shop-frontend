import axios from "axios";
import type { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from "../interfaces/Auth";

const API_URL = import.meta.env.VITE_API_URL_AUTH;


export const login = async (credentials: LoginRequest) => {
    const response = await axios.post<LoginResponse>(`${API_URL}/login`, credentials);
    return response.data;
};


export const signup = async (data: SignupRequest) => {
    const response = await axios.post<SignupResponse>(`${API_URL}/signup`, data);
    return response.data;
};