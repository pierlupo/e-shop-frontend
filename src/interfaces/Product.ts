import type { Category } from "./Category";
import type { Image } from "./Image";

export interface Product {
    productId: number;
    productName: string;
    brand: string;
    price: number;
    inventory: number;
    description: string;
    category: Category;
    images: Image[];
}