import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cart } from '../models/cart';
import { environment } from '../../environments/environment.development';
import { Product } from '../models/product';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  apiURL = environment.apiURL;
  private cart = new BehaviorSubject<Cart[]>([]);
  public cart$ = this.cart.asObservable();

  constructor(private http: HttpClient) { }

  createCart(data: Partial<Cart>): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiURL}api/carts`, data);
  }

  getCarts(page: number = 0, sortBy: string = 'id'): Observable<any> {
    return this.http.get<any>(`${this.apiURL}api/carts?page=${page}&sortBy=${sortBy}`);
  }

  getCart(id: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiURL}api/carts/${id}`);
  }

  updateCart(id: number, data: Partial<Cart>): Observable<Cart> {
    return this.http.patch<Cart>(`${this.apiURL}api/carts/${id}`, data);
  }

  deleteCart(id: number): Observable<string> {
    return this.http.delete(`${this.apiURL}api/carts/${id}`, { responseType: 'text' });
  }

  setCart$(cart: Cart[]): void {
    this.cart.next(cart);
  }
}