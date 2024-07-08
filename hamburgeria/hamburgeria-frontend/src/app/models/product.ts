import { Category } from "./category";

export interface Product {
        id: number;
        italianName: string;
        englishName: string;
        italianDescription: string;
        englishDescription: string;
        price: number;
        category: string;
        available: boolean;
}
