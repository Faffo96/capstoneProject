import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { MenuService } from '../../Services/menu.service';
import { CustomizableProductService } from '../../Services/customizable-product.service';
import { CustomizableProductDTO } from '../../models/customizable-product-dto';


@Component({
  selector: 'app-dessert',
  templateUrl: './dessert.component.html',
  styleUrls: ['./dessert.component.scss']
})
export class DessertComponent implements OnInit {
  menuProducts: Product[] = [];
  selectedProducts: Product[] = [];
  sections: { name: string, products: Product[] }[] = [
    { name: 'Base', products: [] },
    { name: 'Topping (Max 2)', products: [] },
    { name: 'Snack e biscotti (Max 1)', products: [] },
  ];

  constructor(private menuService: MenuService, private customizableProductService: CustomizableProductService) {
    this.menuService.products$.subscribe(data => {
      this.menuProducts = data;
      this.loadCategories();
    });
  }

  ngOnInit(): void {
    this.menuService.getProducts().subscribe(data => {
      this.menuService.setProducts(data);
    });
  }

  loadCategories() {
    this.sections.forEach(section => section.products = []); // Reset sections

    for (let product of this.menuProducts) {
      switch (product.category) {
        case 'DESSERT_BASE':
          this.sections.find(section => section.name === 'Base')?.products.push(product);
          break;
        case 'DESSERT_TOPPING':
          this.sections.find(section => section.name === 'Topping (Max 2)')?.products.push(product);
          break;
        case 'DESSERT_SNACK':
          this.sections.find(section => section.name === 'Snack e biscotti (Max 1)')?.products.push(product);
          break;
        default:
          break;
      }
    }
  }

  toggleProductSelection(product: Product) {
    /* if (this.isSelected(product)) {
      this.selectedProducts = this.selectedProducts.filter(p => p.id !== product.id);
    } else { */
      if (product.category === 'DESSERT_BASE') {
        this.selectedProducts = this.selectedProducts.filter(p => p.category !== product.category);
      } else if (product.category === 'DESSERT_TOPPING' && this.selectedProducts.filter(p => p.category === 'DESSERT_TOPPING').length >= 2) {
        alert('You can select up to 2 toppings only.');
        return;
      } else if (product.category === 'DESSERT_SNACK' && this.selectedProducts.filter(p => p.category === 'DESSERT_SNACK').length >= 1) {
        alert('You can select up to 1 snack or biscuit only.');
        return;
      }
      this.selectedProducts.push(product);
    /* } */
    console.log('Selected products:', this.selectedProducts.map(p => p.id));
  }

  isSelected(product: Product): boolean {
    return this.selectedProducts.some(p => p.id === product.id);
  }

  isSelectionDisabled(sectionName: string, product: Product): boolean {
    if (sectionName === 'Base') {
      return false;
    } else if (sectionName === 'Topping (Max 2)') {
      return this.selectedProducts.filter(p => p.category === 'DESSERT_TOPPING').length >= 2 && !this.isSelected(product);
    } else if (sectionName === 'Snack e biscotti (Max 1)') {
      return this.selectedProducts.filter(p => p.category === 'DESSERT_SNACK').length >= 1 && !this.isSelected(product);
    } else {
      return !this.isBaseSelected();
    }
  }

  isBaseSelected(): boolean {
    return this.selectedProducts.some(p => p.category === 'DESSERT_BASE');
  }

  resetSelections() {
    this.selectedProducts = [];
    console.log('Selections reset');
  }

  createCustomizableDessert() {
    const customizableProduct: CustomizableProductDTO = {
      id: 0,
      italianName: 'Dessert',
      englishName: 'Dessert',
      italianDescription: '',
      englishDescription: '',
      price: this.selectedProducts.reduce((sum, product) => sum + product.price, 0),
      category: "DESSERT",
      available: true,
      productList: this.selectedProducts.map(product => product.id)
    };

    this.customizableProductService.createCustomizableProduct(customizableProduct).subscribe(response => {
      console.log('Customizable Dessert created:', response);
      this.menuService.setCartProducts([...this.menuService.getCartProductsValue(), response]);
      this.selectedProducts = []; // Reset selected products after creating the dessert
    });
  }
}