import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { ProductService } from '../../Services/product.service';

@Component({
  selector: 'app-fries',
  templateUrl: './fries.component.html',
  styleUrls: ['./fries.component.scss']
})
export class FriesComponent implements OnInit {
  menuProducts: Product[] = [];
  selectedProducts: Product[] = [];
  sections: { name: string, products: Product[] }[] = [
    { name: 'Patate Fritte', products: [] },
    { name: 'Pollo Fritto', products: [] },
    { name: 'Altre Fritture', products: [] },
    { name: 'Salse', products: [] }
  ];

  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      this.productService.setProducts(data);
    });
  }

  constructor(private productService: ProductService) {
    this.productService.products$.subscribe(data => {
      this.menuProducts = data;
      this.loadCategories();
    });

    this.productService.currentCartProducts$.subscribe(data => {
      this.selectedProducts = data;
    });
  }

  loadCategories() {
    this.sections.forEach(section => section.products = []); // Reset sections

    for (let i = 0; i < this.menuProducts.length; i++) {
      const e = this.menuProducts[i];
      switch (e.category) {
        case 'FRI_FRENCHFRIES':
          this.sections.find(section => section.name === 'Patate Fritte')?.products.push(e);
          break;
        case 'FRI_FRIEDCHICKEN':
          this.sections.find(section => section.name === 'Pollo Fritto')?.products.push(e);
          break;
        case 'FRI_OTHERFRIE':
          this.sections.find(section => section.name === 'Altre Fritture')?.products.push(e);
          break;
        case 'FRI_SAUCE':
          this.sections.find(section => section.name === 'Salse')?.products.push(e);
          break;
        default:
          break;
      }
    }
  }

  addProductToCart(cartProduct: Product) {
    console.log('Product added to cart:', cartProduct);

    let currentProducts = this.productService.getCartProductsValue();

    this.productService.setCartProducts([...currentProducts, cartProduct]);
  }

  isSelected(product: Product): boolean {
    return this.selectedProducts.some(p => p.id === product.id);
  }

}
