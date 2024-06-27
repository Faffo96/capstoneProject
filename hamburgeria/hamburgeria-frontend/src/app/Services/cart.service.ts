import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cart } from '../models/cart';
import { environment } from '../../environments/environment.development';
import { Product } from '../models/product';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  apiURL = environment.apiURL;
  private cart = new BehaviorSubject<Product[]> ([]);
  public cart$ = this.cart.asObservable(); 

  constructor(private http: HttpClient) { }

  createCart(data: Cart) {
    return this.http.post<Cart>(`${this.apiURL}api/carts`, data);
  }

  getCarts() {
    return this.http.get<Cart[]>(`${this.apiURL}api/carts`);
  }

  getCart(id: number) {
    return this.http.get<Cart>(`${this.apiURL}api/carts/${id}`);
  }

  updateCart(id: number, data: Partial<Cart>) {
    return this.http.patch<Cart>(`${this.apiURL}api/carts/${id}`, data);
  }

  deleteCart(id: Cart) {
    return this.http.delete(`${this.apiURL}api/carts/${id}`);
  }

  setCart$(cart: Product[]) {
    this.cart.next(cart);
  }
}
