import { Component } from '@angular/core';
import { CartService } from '../../Services/cart.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  products: Product[] = [];

  constructor(private cartService: CartService) {
    this.cartService.cart$.subscribe(data => {
      this.products = data;
    })
  }
}
