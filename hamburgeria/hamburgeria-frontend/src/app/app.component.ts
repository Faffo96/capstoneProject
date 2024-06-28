import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Product } from './models/product';
import { MenuService } from './Services/menu.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService, private menuService: MenuService) {}

  ngOnInit() {
    this.authService.restore();
    this.loadProducts();
  }

  loadProducts(): void {
    this.menuService.getProducts().subscribe(
      (data: Product[]) => {
        this.menuService.setProducts(data);
      },
      error => {
        console.error('Error loading products', error);
      }
    );
  }
}
