import { Component } from '@angular/core';
import { Product } from '../../models/product';
import { MenuService } from '../../Services/menu.service';

@Component({
  selector: 'app-dessert',
  templateUrl: './dessert.component.html',
  styleUrl: './dessert.component.scss'
})
export class DessertComponent {
  menuProducts: Product[] = [];
  selectedProducts: Product[] = [];
  sections: { name: string, products: Product[] }[] = [
    { name: 'Base', products: [] },
    { name: 'Topping (Max 2)', products: [] },
    { name: 'Snack e biscotti (Max 1)', products: [] },
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

    this.menuService.currentCartProducts$.subscribe(data => {
      this.selectedProducts = data;
    });
  }
  loadCategories() {
    this.sections.forEach(section => section.products = []); // Reset sections

    for (let i = 0; i < this.menuProducts.length; i++) {
      const e = this.menuProducts[i];
      /* if (e.category === "CUSTOMSANDHOT_VEGETABLE" && e.italianName === "Melanzane" || e.italianName === "Peperoni" || e.italianName === "Radicchio Arrosto" || e.italianName === "Zucchine Arrosto") {
        this.sections.find(section => section.name === 'Verdure Arrosto')?.products.push(e);
      } */


      switch (e.category) {
        case 'DESSERT_BASE':
          this.sections.find(section => section.name === 'Base')?.products.push(e);
          break;
        case 'DESSERT_TOPPING':
          this.sections.find(section => section.name === 'Topping (Max 2)')?.products.push(e);
          break;
        case 'DESSERT_SNACK':
          this.sections.find(section => section.name === 'Snack e biscotti (Max 1)')?.products.push(e);
          break;
        default:
          break;
      }
    }
  }

  addProductToCart(cartProduct: Product) {
    console.log('Product added to cart:', cartProduct);

    let currentProducts = this.menuService.getCartProductsValue();

    if (cartProduct.category === 'DESSERT_BASE') {
      currentProducts = currentProducts.filter(product => product.category !== cartProduct.category);
      this.selectedProducts = this.selectedProducts.filter(product => product.category !== cartProduct.category);
    }

    this.menuService.setCartProducts([...currentProducts, cartProduct]);
  }

  isSelected(product: Product): boolean {
    return this.selectedProducts.some(p => p.id === product.id);
  }

}
