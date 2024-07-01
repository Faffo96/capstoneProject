import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { CustomizableProductService } from '../../Services/customizable-product.service';
import { CustomizableProductDTO } from '../../models/customizable-product-dto';
import { ProductService } from '../../Services/product.service';

@Component({
    selector: 'app-customize-burger',
    templateUrl: './customize-burger.component.html',
    styleUrls: ['./customize-burger.component.scss']
  })
  export class CustomizeBurgerComponent implements OnInit {
    menuProducts: Product[] = [];
    selectedProducts: Product[] = [];
    sections: { name: string, products: Product[] }[] = [
      { name: 'Pane', products: [] },
      { name: 'Hamburger', products: [] },
      { name: 'Verdure', products: [] },
      { name: 'Formaggi', products: [] },
      { name: 'Salse', products: [] },
      { name: 'Varie', products: [] }
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
          case 'CUSTOMHAM_MEAT':
            this.sections.find(section => section.name === 'Hamburger')?.products.push(product);
            break;
          case 'CUSTOMHAM_BREAD':
            this.sections.find(section => section.name === 'Pane')?.products.push(product);
            break;
          case 'CUSTOMHAM_CHEESE':
            this.sections.find(section => section.name === 'Formaggi')?.products.push(product);
            break;
          case 'CUSTOMHAM_VEGETABLE':
            this.sections.find(section => section.name === 'Verdure')?.products.push(product);
            break;
          case 'CUSTOMHAM_SAUCE':
            this.sections.find(section => section.name === 'Salse')?.products.push(product);
            break;
          case 'CUSTOMHAM_OTHER':
            this.sections.find(section => section.name === 'Varie')?.products.push(product);
            break;
          default:
            break;
        }
      }
    }
  
    toggleProductSelection(product: Product) {
      if (product.category === 'CUSTOMHAM_MEAT' || product.category === 'CUSTOMHAM_BREAD') {
        this.selectedProducts = this.selectedProducts.filter(p => p.category !== product.category);
      }
      this.selectedProducts.push(product);
      console.log('Selected products:', this.selectedProducts.map(p => p.id));
    }
  
    isSelected(product: Product): boolean {
      return this.selectedProducts.some(p => p.id === product.id);
    }
  
    isSelectionDisabled(sectionName: string, product: Product): boolean {
      if (sectionName === 'Pane') {
        return false;
      } else if (sectionName === 'Hamburger') {
        return !this.isBreadSelected();
      } else {
        return !this.isBreadSelected() || !this.isMeatSelected();
      }
    }
  
    isBreadSelected(): boolean {
      return this.selectedProducts.some(p => p.category === 'CUSTOMHAM_BREAD');
    }
  
    isMeatSelected(): boolean {
      return this.selectedProducts.some(p => p.category === 'CUSTOMHAM_MEAT');
    }
  
    resetSelections() {
      this.selectedProducts = [];
      console.log('Selections reset');
    }
  
    createCustomizableBurger() {
      const customizableProduct: CustomizableProductDTO = {
        id: 0,
        italianName: 'Burger',
        englishName: 'Burger',
        italianDescription: '',
        englishDescription: '',
        price: this.selectedProducts.reduce((sum, product) => sum + product.price, 0),
        category: "CUSTOM_BURGER",
        available: true,
        productList: this.selectedProducts.map(product => product.id)
      };
  
      this.customizableProductService.createCustomizableProduct(customizableProduct).subscribe(response => {
        console.log('Customizable Burger created:', response);
        this.productService.setCartProducts([...this.productService.getCartProductsValue(), response]);
        window.alert("Burger aggiunto al carrello");
        this.selectedProducts = []; // Reset selected products after creating the burger
      });
    }
  }