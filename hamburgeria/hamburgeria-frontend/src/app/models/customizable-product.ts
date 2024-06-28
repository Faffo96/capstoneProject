import { Product } from "./product";

export interface CustomizableProduct extends Product {
  productList: number[];
}