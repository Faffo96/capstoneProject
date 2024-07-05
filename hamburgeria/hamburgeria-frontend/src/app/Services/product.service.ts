import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product';
import { CustomizableProduct } from '../models/customizable-product';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  apiURL = environment.apiURL;

  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  private cartProductsSubject = new BehaviorSubject<(Product | CustomizableProduct)[]>([]);
  currentCartProducts$ = this.cartProductsSubject.asObservable();

  private selectedProducts = [];

  constructor(private http: HttpClient) {}

  createProduct(data: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.apiURL}api/products`, data);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiURL}api/products`);
  }

  setProducts(products: Product[]): void {
    this.productsSubject.next(products);
  }

  getProductById(id: number): Product | undefined {
    console.log("Current products:", this.productsSubject.getValue());
    return this.productsSubject.getValue().find(product => product.id === id);
  }

  getCartProductsValue(): (Product | CustomizableProduct)[] {
    return this.cartProductsSubject.getValue();
  }

  setCartProducts(products: (Product | CustomizableProduct)[]): void {
    this.cartProductsSubject.next(products);
  }

  updateProduct(id: number, data: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiURL}api/products/${id}`, data);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}api/products/${id}`);
  }
}