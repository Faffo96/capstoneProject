import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { MenuService } from '../../Services/menu.service';
import { CustomizableProductDTO } from '../../models/customizable-product-dto';
import { CustomizableProductService } from '../../Services/customizable-product.service';

@Component({
  selector: 'app-customize-sandwich',
  templateUrl: './customize-sandwich.component.html',
  styleUrls: ['./customize-sandwich.component.scss']
})
export class CustomizeSandwichComponent implements OnInit {
  menuProducts: Product[] = [];
  selectedProducts: Product[] = [];
  sections: { name: string, products: Product[] }[] = [
    { name: 'Base', products: [] },
    { name: 'Formaggi', products: [] },
    { name: 'Verdure', products: [] },
    { name: 'Salse', products: [] },
    { name: 'Varie', products: [] }
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
        case 'CUSTOMSAND_BASE':
          this.sections.find(section => section.name === 'Base')?.products.push(product);
          break;
        case 'CUSTOMSANDHOT_CHEESE':
          this.sections.find(section => section.name === 'Formaggi')?.products.push(product);
          break;
        case 'CUSTOMSANDHOT_VEGETABLE':
          this.sections.find(section => section.name === 'Verdure')?.products.push(product);
          break;
        case 'CUSTOMSANDHOT_SAUCE':
          this.sections.find(section => section.name === 'Salse')?.products.push(product);
          break;
        case 'CUSTOMSANDHOT_OTHER':
          this.sections.find(section => section.name === 'Varie')?.products.push(product);
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
      if (product.category === 'CUSTOMSAND_BASE') {
        this.selectedProducts = this.selectedProducts.filter(p => p.category !== product.category);
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
    } else {
      return !this.isBaseSelected();
    }
  }

  isBaseSelected(): boolean {
    return this.selectedProducts.some(p => p.category === 'CUSTOMSAND_BASE');
  }

  resetSelections() {
    this.selectedProducts = [];
    console.log('Selections reset');
  }

  createCustomizableSandwich() {
    const customizableProduct: CustomizableProductDTO = {
      id: 0,
      italianName: 'Sandwich',
      englishName: 'Sandwich',
      italianDescription: '',
      englishDescription: '',
      price: this.selectedProducts.reduce((sum, product) => sum + product.price, 0),
      category: "SANDWICH",
      available: true,
      productList: this.selectedProducts.map(product => product.id)
    };

    this.customizableProductService.createCustomizableProduct(customizableProduct).subscribe(response => {
      console.log('Customizable Sandwich created:', response);
      this.menuService.setCartProducts([...this.menuService.getCartProductsValue(), response]);
      this.selectedProducts = []; // Reset selected products after creating the sandwich
    });
  }
}