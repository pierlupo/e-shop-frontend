import apiClient from "../utils/apiClient.ts";import type {User} from "../interfaces/User";
import {AUTH_API_URL, USERS_API_URL} from "../config/config";

export const userService = {

    getUserById: async (userId: number): Promise<User> => {
        const response = await apiClient.get(`${USERS_API_URL}/user/${userId}`);
        return response.data.data;
    },

    createUser: async (userData: Partial<User>): Promise<User> => {
        const response = await apiClient.post(`${USERS_API_URL}/add`, userData);
        return response.data.data;
    },
    updateUser: async (userId: number, userData: Partial<User>): Promise<User> => {
        const response = await apiClient.put(`${USERS_API_URL}/${userId}/update`, userData);
        return response.data.data;
    },

    deleteUser: async (userId: number): Promise<void> => {
        await apiClient.delete(`${USERS_API_URL}/${userId}/delete`);
    },

    changePassword: async (userId: number, data: { currentPassword: string; newPassword: string }) => {
        const response =  await apiClient.put(`${USERS_API_URL}/${userId}/change-password`, data);
        return response.data.data;
    },

    uploadAvatar: async (userId: number, file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("avatar", file);
        const response = await apiClient.post(
            `${USERS_API_URL}/${userId}/avatar`, formData
        );
        return response.data.data;
    },

    sendVerificationEmail: async (userId: number): Promise<void> => {
        await apiClient.post(`${AUTH_API_URL}/${userId}/verify-email`);
    },

};