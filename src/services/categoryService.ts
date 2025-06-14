import {CATEGORY_API_URL} from "../config/config.ts";
import type {Category} from "../interfaces/Category.ts";
import apiClient from "../utils/apiClient.ts";


export const categoryService = {
    getAllCategories: async (): Promise<Category[]> => {
        const res = await apiClient.get(`${CATEGORY_API_URL}/all`);
        return res.data.data;
    }
}