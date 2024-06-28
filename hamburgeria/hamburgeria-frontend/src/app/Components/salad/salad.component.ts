import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { MenuService } from '../../Services/menu.service';
import { CustomizableProductService } from '../../Services/customizable-product.service';
import { CustomizableProductDTO } from '../../models/customizable-product-dto';


@Component({
  selector: 'app-salad',
  templateUrl: './salad.component.html',
  styleUrls: ['./salad.component.scss']
})
export class SaladComponent implements OnInit {
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
        case 'CUSTOMSALAD_BASE':
          this.sections.find(section => section.name === 'Base')?.products.push(product);
          break;
        case 'CUSTOMSALAD_CHEESE':
          this.sections.find(section => section.name === 'Formaggi')?.products.push(product);
          break;
        case 'CUSTOMSALAD_FVEGETABLES':
          this.sections.find(section => section.name === 'Verdure Fresche')?.products.push(product);
          break;
        case 'CUSTOMSALAD_CVEGETABLES':
          this.sections.find(section => section.name === 'Verdure Arrosto')?.products.push(product);
          break;
        case 'CUSTOMSALAD_SAUCE':
          this.sections.find(section => section.name === 'Salse')?.products.push(product);
          break;
        case 'CUSTOMSALAD_OTHER':
          this.sections.find(section => section.name === 'Varie')?.products.push(product);
          break;
        default:
          break;
      }
    }
  }

  toggleProductSelection(product: Product) {
    if (product.category === 'CUSTOMSALAD_BASE') {
      this.selectedProducts = this.selectedProducts.filter(p => p.category !== product.category);
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
    return this.selectedProducts.some(p => p.category === 'CUSTOMSALAD_BASE');
  }

  resetSelections() {
    this.selectedProducts = [];
    console.log('Selections reset');
  }

  createCustomizableSalad() {
    const customizableProduct: CustomizableProductDTO = {
      id: 0,
      italianName: 'Insalata',
      englishName: 'Salad',
      italianDescription: '',
      englishDescription: '',
      price: this.selectedProducts.reduce((sum, product) => sum + product.price, 0),
      category: "SALAD",
      available: true,
      productList: this.selectedProducts.map(product => product.id)
    };

    this.customizableProductService.createCustomizableProduct(customizableProduct).subscribe(response => {
      console.log('Customizable Salad created:', response);
      this.menuService.setCartProducts([...this.menuService.getCartProductsValue(), response]);
      this.selectedProducts = []; // Reset selected products after creating the salad
    });
  }
}