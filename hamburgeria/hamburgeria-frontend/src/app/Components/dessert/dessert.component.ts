import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { CustomizableProductService } from '../../Services/customizable-product.service';
import { CustomizableProductDTO } from '../../models/customizable-product-dto';
import { ProductService } from '../../Services/product.service';


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

  constructor(private productService: ProductService, private customizableProductService: CustomizableProductService) {
    this.productService.products$.subscribe(data => {
      this.menuProducts = data;
      this.loadCategories();
    });
  }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      this.productService.setProducts(data);
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
    if (product.category === 'DESSERT_BASE') {
      this.selectedProducts = this.selectedProducts.filter(p => p.category !== product.category);
    } else if (product.category === 'DESSERT_TOPPING' && this.selectedProducts.filter(p => p.category === 'DESSERT_TOPPING').length >= 2) {
      alert('You can select up to 2 toppings only.');
      return;
    } else if (product.category === 'DESSERT_SNACK' && this.selectedProducts.filter(p => p.category === 'DESSERT_SNACK').length >= 1) {
      alert('You can select up to 1 snack or biscuit only.');
      return;
    } else if (!this.isBaseSelected()) {
      alert('Please select a base first.');
      return;
    }
    this.selectedProducts.push(product);
    console.log('Selected products:', this.selectedProducts.map(p => p.id));
  }

  isSelected(product: Product): boolean {
    return this.selectedProducts.some(p => p.id === product.id);
  }

  isSelectionDisabled(sectionName: string, product: Product): boolean {
    if (sectionName === 'Base') {
      return false;
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
      price: this.calculateProductPrice(this.selectedProducts),
      category: "CUSTOM_DESSERT",
      available: true,
      productList: this.selectedProducts.map(product => product.id)
    };

    this.customizableProductService.createCustomizableProduct(customizableProduct).subscribe(response => {
      console.log('Customizable Dessert created:', response);
      this.productService.setCartProducts([...this.productService.getCartProductsValue(), response]);
      this.selectedProducts = []; // Reset selected products after creating the dessert
    });
  }

  calculateProductPrice(products: Product[]): number {
    const basePrice = products.reduce((sum, product) => sum + product.price, 0);
    const freeIngredients = products.filter(product => product.price === 0 && product.category !== 'DESSERT_BASE');
    const extraFreeIngredientsCount = Math.max(freeIngredients.length - 5, 0);
    const extraCharge = extraFreeIngredientsCount * 0.50;
    return basePrice + extraCharge;
  }
}