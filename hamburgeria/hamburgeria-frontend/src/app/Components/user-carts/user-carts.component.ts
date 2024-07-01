import { Component, OnInit } from '@angular/core';
import { Cart } from '../../models/cart';
import { CartService } from '../../Services/cart.service';

@Component({
  selector: 'app-user-carts',
  templateUrl: './user-carts.component.html',
  styleUrl: './user-carts.component.scss'
})
export class UserCartsComponent implements OnInit {

  carts: Cart[] = [];
  currentPage: number = 0;
  totalPages: number = 0;
  pages: number[] = [];
  selectedCart!: Cart;
  isEditModalOpen: boolean = false;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.getCarts(this.currentPage);
  }

  getCarts(page: number): void {
    this.cartService.getCarts(page).subscribe(
      (response: any) => {
        this.carts = response.content;
        this.currentPage = response.number;
        this.totalPages = response.totalPages;
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i);
      },
      (error: any) => {
        console.error('Error fetching carts', error);
        if (error.status === 0) {
          console.error('Could not connect to server. Please make sure the server is running.');
        } else {
          console.error(`Backend returned code ${error.status}, body was: ${error.message}`);
        }
      }
    );
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.getCarts(page);
    }
  }

  openEditModal(cart: Cart): void {
    this.selectedCart = { ...cart };
    this.isEditModalOpen = true;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
  }

  deleteCart(cartId: number): void {
    if (confirm('Sei sicuro di voler annullare questo carrello?')) {
      this.cartService.deleteCart(cartId).subscribe(
        () => {
          this.carts = this.carts.filter(cart => cart.id !== cartId);
          console.log(`Cart with id ${cartId} deleted successfully.`);
        },
        (error) => {
          console.error('Error deleting cart', error);
        }
      );
    }
  }
}