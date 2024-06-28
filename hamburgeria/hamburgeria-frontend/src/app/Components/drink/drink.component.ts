import { Component } from '@angular/core';
import { Product } from '../../models/product';
import { MenuService } from '../../Services/menu.service';

@Component({
  selector: 'app-drink',
  templateUrl: './drink.component.html',
  styleUrl: './drink.component.scss'
})
export class DrinkComponent {
  menuProducts: Product[] = [];
  selectedProducts: Product[] = [];
  sections: { name: string, products: Product[] }[] = [
    { name: 'Drink', products: [] },
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
      if (e.category === "DRINK") {
        this.sections.find(section => section.name === 'Drink')?.products.push(e);
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