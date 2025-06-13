export interface ProductUpdateRequest {
    productName?: string;
    brand?: string;
    price?: number;
    inventory?: number;
    description?: string;
    categoryId?: number;
}