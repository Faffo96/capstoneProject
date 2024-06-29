import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Product } from './models/product';
import { ProductService } from './Services/product.service';
import { DiningTableService } from './Services/dining-table.service';
import { DiningTable } from './models/dining-table';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService, private productService: ProductService, private diningTableService: DiningTableService) {}

  ngOnInit() {
    this.authService.restore();
    this.loadProducts();
    this.loadDiningTables();
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

  loadDiningTables(): void {
    this.diningTableService.getDiningTables().subscribe(
      (response: { content: DiningTable[] }) => {
        const data = response.content;
        console.log(data);
        this.diningTableService.setDbDiningTables(data);
      },
      error => {
        console.error('Error loading dining tables', error);
      }
    );
  }
}
