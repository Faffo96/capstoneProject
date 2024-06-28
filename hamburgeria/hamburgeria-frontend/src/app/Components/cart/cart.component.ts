import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../Services/menu.service';
import { CartService } from '../../Services/cart.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartProducts: Product[] = [];
  total: number = 0;

  constructor(private menuService: MenuService, private cartService: CartService) {}

  ngOnInit() {
    this.menuService.cartProducts$.subscribe(data => {
      this.cartProducts = data;
      this.calculateTotal();
    });
  }

  calculateTotal() {
    this.total = this.cartProducts.reduce((sum, product) => sum + product.price, 0);
  }

  removeProductFromCart(product: Product) {
    this.cartProducts = this.cartProducts.filter(p => p.id !== product.id);
    this.menuService.setCartProducts(this.cartProducts);
  }

  checkout() {
    const cart = {
      productList: this.cartProducts
    };
  

    this.cartService.createCart(cart).subscribe(response => {
      console.log('Cart saved:', response);
      // Clear the cart after successful checkout
      this.cartProducts = [];
      this.menuService.setCartProducts(this.cartProducts);
      this.calculateTotal();
    }, error => {
      console.error('Error saving cart:', error);
    });
  }
}
