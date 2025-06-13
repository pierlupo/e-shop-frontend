import apiClient from "../utils/apiClient";
import type { Product } from "../interfaces/Product";
import type {ProductUpdateRequest} from "../interfaces/ProductUpdateRequest";
import type {ProductCreateRequest} from "../interfaces/ProductCreateRequest.ts";

import { PRODUCTS_API_URL, PRODUCT_API_URL } from "../config/config";

export const productService = {
    getAllProducts: async (): Promise<Product[]> => {
        const res = await apiClient.get(`${PRODUCTS_API_URL}/all`);
        return res.data.data;
    },

    getProductById: async (productId: number): Promise<Product> => {
        const res = await apiClient.get(`${PRODUCT_API_URL}/${productId}`);
        return res.data.data;
    },

    createProduct: async (productData: ProductCreateRequest): Promise<Product> => {
        const res = await apiClient.post(`${PRODUCTS_API_URL}/add`, productData);
        return res.data.data;
    },

    updateProduct: async (
        productId: number,
        productData: ProductUpdateRequest
    ): Promise<Product> => {
        const res = await apiClient.put(`${PRODUCT_API_URL}/${productId}/update`, productData);
        return res.data.data;
    },

    deleteProduct: async (productId: number): Promise<void> => {
        await apiClient.delete(`${PRODUCT_API_URL}/${productId}/delete`);
    },
};