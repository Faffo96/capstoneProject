import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product';
import { CustomizableProduct } from '../models/customizable-product';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  private cartProductsSubject = new BehaviorSubject<(Product | CustomizableProduct)[]>([]);
  currentCartProducts$ = this.cartProductsSubject.asObservable();

  private selectedProducts = [];

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('http://localhost:8080/api/products');
  }

  setProducts(products: Product[]): void {
    this.productsSubject.next(products);
  }

  getProductById(id: number): Product | undefined {
    console.log("Current products:", this.productsSubject.getValue());
    let products = this.productsSubject.getValue()
    for (let i = 0; i < products.length; i++) {
      const element = products[i];
      if (element.id === id) {
        return element;
      } 
    }
    return undefined;
  }

  getCartProductsValue(): (Product | CustomizableProduct)[] {
    return this.cartProductsSubject.getValue();
  }

  setCartProducts(products: (Product | CustomizableProduct)[]): void {
    this.cartProductsSubject.next(products);
  }
}

