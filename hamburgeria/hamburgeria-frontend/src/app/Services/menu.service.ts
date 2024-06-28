import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  apiURL = environment.apiURL;
  private products = new BehaviorSubject<Product[]>([]);
  public products$ = this.products.asObservable();

  private cartProducts = new BehaviorSubject<Product[]>([]);
  public cartProducts$ = this.cartProducts.asObservable();

  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get<Product[]>(`${this.apiURL}api/products`);
  }

  getProduct(id: number) {
    return this.http.get<Product>(`${this.apiURL}api/products/${id}`);
  }

  createProduct(data: Partial<Product>) {
    return this.http.post<Product>(`${this.apiURL}api/products`, data);
  }

  updateProduct(id: number, data: Partial<Product>) {
    return this.http.patch<Product>(`${this.apiURL}api/products/${id}`, data);
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.apiURL}api/products/${id}`);
  }

  setProducts(prod: Product[]) {
    this.products.next(prod);
  }

  getProductsValue(): Product[] {
    return this.products.getValue();
  }

  getCartProductsValue(): Product[] {
    return this.cartProducts.getValue();
  }

  setCartProducts(products: Product[]) {
    this.cartProducts.next(products);
  }
}
