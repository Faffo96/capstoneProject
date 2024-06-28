import { Component } from '@angular/core';
import { Product } from '../../models/product';
import { MenuService } from '../../Services/menu.service';

@Component({
  selector: 'app-burger',
  templateUrl: './burger.component.html',
  styleUrl: './burger.component.scss'
})
export class BurgerComponent {
  menuProducts: Product[] = [];
  selectedProducts: Product[] = [];
  sections: { name: string, products: Product[] }[] = [
    { name: 'Burger', products: [] },
  ];

  ngOnInit(): void {
    this.menuService.getProducts().subscribe(data => {
      this.menuService.setProducts(data);
    });
  }

  constructor(private menuService: MenuService) {
    this.menuService.products$.subscribe(data => {
      this.menuProducts = data;
      this.loadCategories();
    });

    this.menuService.cartProducts$.subscribe(data => {
      this.selectedProducts = data;
    });
  }

  loadCategories() {
    this.sections.forEach(section => section.products = []); // Reset sections

    for (let i = 0; i < this.menuProducts.length; i++) {
      const e = this.menuProducts[i];
      if (e.category === "HAMBURGER") {
        this.sections.find(section => section.name === 'Burger')?.products.push(e);
      }
    }
  }

  addProductToCart(cartProduct: Product) {
    console.log('Product added to cart:', cartProduct);

    let currentProducts = this.menuService.getCartProductsValue();

    this.menuService.setCartProducts([...currentProducts, cartProduct]);
  }

  isSelected(product: Product): boolean {
    return this.selectedProducts.some(p => p.id === product.id);
  }
}