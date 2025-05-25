import axios from "axios";
import type { User } from "../interfaces/User";

const API_URL = import.meta.env.VITE_API_URL_USERS;

export const userService = {

    getUserById: async (userId: number): Promise<User> => {
        const response = await axios.get(`${API_URL}/user/${userId}`);
        return response.data.data;
    },
    createUser: async (userData: Partial<User>): Promise<User> => {
        const response = await axios.post(`${API_URL}/add`, userData);
        return response.data.data;
    },
    updateUser: async (userId: number, userData: Partial<User>): Promise<User> => {
        const response = await axios.put(`${API_URL}/${userId}/update`, userData);
        return response.data.data;
    },
    deleteUser: async (userId: number): Promise<void> => {
        await axios.delete(`${API_URL}/${userId}/delete`);
    },

    changePassword: async (id: number, data: { currentPassword: string; newPassword: string }) => {
        return axios.put(`${API_URL}/users/${id}/password`, data);
    }
};