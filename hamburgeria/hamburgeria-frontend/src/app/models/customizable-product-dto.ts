import { Product } from "./product";

export interface CustomizableProductDTO extends Product {
    productList: number[];
  }
