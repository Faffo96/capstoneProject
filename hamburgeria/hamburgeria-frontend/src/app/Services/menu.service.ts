import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MenuService {
  apiURL = environment.apiURL;
  private products = new BehaviorSubject<Product[]> ([]);
  public products$ = this.products.asObservable(); 

  constructor(private http: HttpClient) { }

  getProducts() {
    return this.http.get<Product[]>(`${this.apiURL}api/products`);
  }

  getProduct(id: number) {
    return this.http.get<Product>(`${this.apiURL}api/products/${id}`);
  }

  updateProduct(id: number, data: Partial<Product>) {
    return this.http.patch<Product>(`${this.apiURL}api/products/${id}`, data);
  }

  deleteProduct(id: Product) {
    return this.http.delete(`${this.apiURL}api/products/${id}`);
  }

  setProducts(prod: Product[]) {
    this.products.next(prod);
  }

}
