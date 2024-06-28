import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../Services/menu.service';
import { Product } from '../../models/product';
import { Category } from '../../models/category';

@Component({
  selector: 'app-customize-burger',
  templateUrl: './customize-burger.component.html',
  styleUrls: ['./customize-burger.component.scss']
})
export class CustomizeBurgerComponent implements OnInit {
  menuProducts: Product[] = [];
  sections: { name: string, products: Product[] }[] = [
    { name: 'Pane', products: [] },
    { name: 'Hamburger', products: [] },
    { name: 'Verdure', products: [] },
    { name: 'Formaggi', products: [] },
    { name: 'Salse', products: [] },
    { name: 'Varie', products: [] }
  ];
  selectedProducts: Product[] = [];

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
      switch (e.category) {
        case 'CUSTOMHAM_MEAT':
          this.sections.find(section => section.name === 'Hamburger')?.products.push(e);
          break;
        case 'CUSTOMHAM_BREAD':
          this.sections.find(section => section.name === 'Pane')?.products.push(e);
          break;
        case 'CUSTOMHAM_CHEESE':
          this.sections.find(section => section.name === 'Formaggi')?.products.push(e);
          break;
        case 'CUSTOMHAM_VEGETABLE':
          this.sections.find(section => section.name === 'Verdure')?.products.push(e);
          break;
        case 'CUSTOMHAM_SAUCE':
          this.sections.find(section => section.name === 'Salse')?.products.push(e);
          break;
        case 'CUSTOMHAM_OTHER':
          this.sections.find(section => section.name === 'Varie')?.products.push(e);
          break;
        default:
          break;
      }
    }
  }

  addProductToCart(cartProduct: Product) {
    console.log('Product added to cart:', cartProduct);

    let currentProducts = this.menuService.getCartProductsValue();

    if (cartProduct.category === 'CUSTOMHAM_MEAT' || cartProduct.category === 'CUSTOMHAM_BREAD') {
      currentProducts = currentProducts.filter(product => product.category !== cartProduct.category);
      this.selectedProducts = this.selectedProducts.filter(product => product.category !== cartProduct.category);
    }

    
    this.menuService.setCartProducts([...currentProducts, cartProduct]);
  }

  /* removeProductFromCart(product: Product) {
    let currentProducts = this.menuService.getCartProductsValue();
    currentProducts = currentProducts.filter(p => p.id !== product.id);
    this.menuService.setCartProducts(currentProducts);
  } */

  isSelected(product: Product): boolean {
    return this.selectedProducts.some(p => p.id === product.id);
  }
}
