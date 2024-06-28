import { Component } from '@angular/core';
import { Product } from '../../models/product';
import { MenuService } from '../../Services/menu.service';

@Component({
  selector: 'app-salad',
  templateUrl: './salad.component.html',
  styleUrl: './salad.component.scss'
})
export class SaladComponent {
  menuProducts: Product[] = [];
  selectedProducts: Product[] = [];
  sections: { name: string, products: Product[] }[] = [
    { name: 'Base', products: [] },
    { name: 'Formaggi', products: [] },
    { name: 'Verdure Fresche', products: [] },
    { name: 'Verdure Arrosto', products: [] },
    { name: 'Salse', products: [] },
    { name: 'Varie', products: [] }
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
      /* if (e.category === "CUSTOMSANDHOT_VEGETABLE" && e.italianName === "Melanzane" || e.italianName === "Peperoni" || e.italianName === "Radicchio Arrosto" || e.italianName === "Zucchine Arrosto") {
        this.sections.find(section => section.name === 'Verdure Arrosto')?.products.push(e);
      } */
      switch (e.category) {
        case 'CUSTOMSALAD_BASE':
          this.sections.find(section => section.name === 'Base')?.products.push(e);
          break;
        case 'CUSTOMSALAD_CHEESE':
          this.sections.find(section => section.name === 'Formaggi')?.products.push(e);
          break;
        case 'CUSTOMSALAD_FVEGETABLES':
          this.sections.find(section => section.name === 'Verdure Fresche')?.products.push(e);
          break;
        case 'CUSTOMSALAD_CVEGETABLES':
          this.sections.find(section => section.name === 'Verdure Arrosto')?.products.push(e);
          break;
          case 'CUSTOMSALAD_SAUCE':
          this.sections.find(section => section.name === 'Varie')?.products.push(e);
          break;
          case 'CUSTOMSALAD_OTHER':
          this.sections.find(section => section.name === 'Salse')?.products.push(e);
          break;
        default:
          break;
      }
    }
  }

  addProductToCart(cartProduct: Product) {
    console.log('Product added to cart:', cartProduct);

    let currentProducts = this.menuService.getCartProductsValue();

    if (cartProduct.category === 'CUSTOMSALAD_BASE') {
      currentProducts = currentProducts.filter(product => product.category !== cartProduct.category);
      this.selectedProducts = this.selectedProducts.filter(product => product.category !== cartProduct.category);
    }

    this.menuService.setCartProducts([...currentProducts, cartProduct]);
  }

  isSelected(product: Product): boolean {
    return this.selectedProducts.some(p => p.id === product.id);
  }

}
