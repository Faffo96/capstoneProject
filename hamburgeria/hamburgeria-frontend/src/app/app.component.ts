import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Product } from './models/product';
import { ProductService } from './Services/product.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService, private productService: ProductService) {}

  ngOnInit() {
    this.authService.restore();
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (data: Product[]) => {
        this.productService.setProducts(data);
      },
      error => {
        console.error('Error loading products', error);
      }
    );
  }
}
