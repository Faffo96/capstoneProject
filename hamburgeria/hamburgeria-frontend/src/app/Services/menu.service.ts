import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomizableProduct } from '../models/customizable-product';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  private cartProductsSubject = new BehaviorSubject<(Product | CustomizableProduct)[]>([]);
  currentCartProducts$ = this.cartProductsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('http://localhost:8080/api/products');
  }

  setProducts(products: Product[]): void {
    this.productsSubject.next(products);
  }

  getProductById(id: number): Product | undefined {
    console.log()
    console.log("Current products:", this.productsSubject.getValue());
    const product = this.productsSubject.getValue().find(product => product.id === id);
    console.log("Found product:", product);
    return product;
  }

  getCartProductsValue(): (Product | CustomizableProduct)[] {
    return this.cartProductsSubject.getValue();
  }

  setCartProducts(products: (Product | CustomizableProduct)[]): void {
    this.cartProductsSubject.next(products);
  }
}
