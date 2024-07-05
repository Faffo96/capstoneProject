import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { CustomizableProductService } from '../../Services/customizable-product.service';
import { CustomizableProductDTO } from '../../models/customizable-product-dto';
import { ProductService } from '../../Services/product.service';
import { ErrorService } from '../../Services/error-service.service';


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

  constructor(
    private productService: ProductService,
    private customizableProductService: CustomizableProductService,
    private errorService: ErrorService
  ) {
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
    if (!this.isBaseSelected()) {
      this.errorService.showMenuSectionsError('Per favore, seleziona almeno la base.');
      return;
    }

    const customizableProduct: CustomizableProductDTO = {
      id: 0,
      italianName: 'Insalata',
      englishName: 'Salad',
      italianDescription: '',
      englishDescription: '',
      price: this.selectedProducts.reduce((sum, product) => sum + product.price, 0),
      category: "CUSTOM_SALAD",
      available: true,
      productList: this.selectedProducts.map(product => product.id)
    };

    this.customizableProductService.createCustomizableProduct(customizableProduct).subscribe(response => {
      console.log('Customizable Salad created:', response);
      this.productService.setCartProducts([...this.productService.getCartProductsValue(), response]);
      this.errorService.showErrorModal('✅Insalatona aggiunta', 'Insalatona aggiunta al carrello');
      this.selectedProducts = []; // Reset selected products after creating the salad
    }, error => {
      this.errorService.showErrorModal('❌ Errore', 'Errore durante la creazione dell\'insalatona');
    });
  }
}