import { Component } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../Services/product.service';

@Component({
  selector: 'app-burger',
  templateUrl: './burger.component.html',
  styleUrl: './burger.component.scss'
})
export class BurgerComponent {
  menuProducts: Product[] = [];
  selectedProducts: Product[] = [];
  sections: { name: string, products: Product[] }[] = [
    { name: 'Burger', products: [] },
  ];
  
  constructor(private productService: ProductService) {
    this.productService.products$.subscribe(data => {
      this.menuProducts = data;
      this.loadCategories();
    });

    this.productService.currentCartProducts$.subscribe(data => {
      this.selectedProducts = data;
    });
  }
  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      this.productService.setProducts(data);
    });
  }


  loadCategories() {
    this.sections.forEach(section => section.products = []); // Reset sections

    for (let i = 0; i < this.menuProducts.length; i++) {
      const e = this.menuProducts[i];
      if (e.category === "CUSTOM_BURGER") {
        this.sections.find(section => section.name === 'Burger')?.products.push(e);
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