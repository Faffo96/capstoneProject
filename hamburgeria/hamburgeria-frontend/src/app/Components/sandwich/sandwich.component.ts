import { Component } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../Services/product.service';

@Component({
  selector: 'app-sandwich',
  templateUrl: './sandwich.component.html',
  styleUrl: './sandwich.component.scss'
})
export class SandwichComponent {
  menuProducts: Product[] = [];
  selectedProducts: Product[] = [];
  sections: { name: string, products: Product[] }[] = [
    { name: 'Sandwich', products: [] },
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

      if (e.category === "SANDWICH") {
        this.sections.find(section => section.name === 'Sandwich')?.products.push(e);
      }
    }
  }

  addProductToCart(cartProduct: Product) {
    console.log('Product added to cart:', cartProduct);

    let currentProducts = this.productService.getCartProductsValue();

    if (cartProduct.category === 'CUSTOMSALAD_BASE') {
      currentProducts = currentProducts.filter(product => product.category !== cartProduct.category);
      this.selectedProducts = this.selectedProducts.filter(product => product.category !== cartProduct.category);
    }

    this.productService.setCartProducts([...currentProducts, cartProduct]);
  }

  isSelected(product: Product): boolean {
    return this.selectedProducts.some(p => p.id === product.id);
  }

}
