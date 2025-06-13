export interface ProductCreateRequest {
    productName: string;
    brand: string;
    price: number;
    inventory: number;
    description: string;
    categoryId: number; // assuming category selection by ID
}