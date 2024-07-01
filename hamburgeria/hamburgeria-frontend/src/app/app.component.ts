import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Product } from './models/product';
import { ProductService } from './Services/product.service';
import { DiningTableService } from './Services/dining-table.service';
import { DiningTable } from './models/dining-table';
import { UserService } from './Services/user.service';
import { User } from './models/user';
import { Observable, of, switchMap } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  user: User | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private productService: ProductService,
    private diningTableService: DiningTableService
  ) {
    this.authService.restore();
    this.loadLoggedUser();
    this.loadProducts();
    this.loadDiningTables();

    this.userService.user$.subscribe(user => {
      this.user = user;
      console.log('User updated:', user);
    });
  }

  ngOnInit() {
    
  }

  loadLoggedUser(): void {
    const token = this.authService.getToken();
    if (token) {
      this.userService.getUserFromToken(token).pipe(
        switchMap((user: User) => {
          return this.userService.setUser(user)
        })
      ).subscribe(
        (user: User | null) => {
          console.log('User loaded and set:', user);
        },
        error => {
          console.error('Error fetching user', error);
        }
      );
    } else {
      console.error('Token is null');
    }
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