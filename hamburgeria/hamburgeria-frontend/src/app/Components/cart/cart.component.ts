import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../Services/menu.service';
import { CartService } from '../../Services/cart.service';
import { Product } from '../../models/product';
import { CustomizableProduct } from '../../models/customizable-product';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartProducts: (Product | CustomizableProduct)[] = [];
  total: number = 0;

  constructor(private menuService: MenuService, private cartService: CartService) {}

  ngOnInit() {
    this.menuService.currentCartProducts$.subscribe(data => {
      this.cartProducts = data;
      this.calculateTotal();
    });
  }

  calculateTotal() {
    this.total = this.cartProducts.reduce((sum, product) => {
      return sum + this.getProductTotal(product);
    }, 0);
  }

  getProductTotal(product: Product | CustomizableProduct): number {
    if (this.isCustomizableProduct(product)) {
      const basePrice = product.productList.reduce((sum, ingredient) => sum + ingredient.price, 0);
      const freeIngredients = product.productList.filter(ingredient => ingredient.price === 0 && !this.isBase(ingredient));
      const extraFreeIngredientsCount = Math.max(freeIngredients.length - 5, 0);
      const extraCharge = extraFreeIngredientsCount * 0.50;
      return basePrice + extraCharge;
    } else {
      return product.price;
    }
  }

  getIngredientPrice(ingredient: Product, customizableProduct: CustomizableProduct): string {
    const freeIngredients = customizableProduct.productList.filter(ing => ing.price === 0 && !this.isBase(ing));
    const extraFreeIngredientsCount = Math.max(freeIngredients.length - 5, 0);
    const ingredientIndex = freeIngredients.indexOf(ingredient);
    if (ingredient.price === 0 && ingredientIndex >= 5) {
      return (ingredient.price + 0.50).toFixed(2);
    } else {
      return ingredient.price.toFixed(2);
    }
  }

  removeProductFromCart(product: Product | CustomizableProduct) {
    this.cartProducts = this.cartProducts.filter(p => p.id !== product.id);
    this.menuService.setCartProducts(this.cartProducts);
    this.calculateTotal();
  }

  removeIngredient(customizableProduct: CustomizableProduct, ingredientIndex: number, event: MouseEvent) {
    event.stopPropagation();
    const ingredient = customizableProduct.productList[ingredientIndex];
    customizableProduct.productList.splice(ingredientIndex, 1);
    this.updateProductPrice(customizableProduct); // Aggiorna il prezzo considerando gli ingredienti gratuiti in eccesso
    this.calculateTotal();
    this.menuService.setCartProducts(this.cartProducts);
  }

  updateProductPrice(customizableProduct: CustomizableProduct) {
    const freeIngredients = customizableProduct.productList.filter(ingredient => ingredient.price === 0 && !this.isBase(ingredient));
    const extraFreeIngredientsCount = Math.max(freeIngredients.length - 5, 0);
    const extraCharge = extraFreeIngredientsCount * 0.50;
    customizableProduct.price = customizableProduct.productList.reduce((sum, ingredient) => sum + ingredient.price, 0) + extraCharge;
  }

  isBase(ingredient: Product): boolean {
    return ingredient.category === 'DESSERT_BASE';
  }

  checkout() {
    const cart = {
      productList: this.cartProducts
    };

    this.cartService.createCart(cart).subscribe(response => {
      console.log('Cart saved:', response);
      // Clear the cart after successful checkout
      this.cartProducts = [];
      this.menuService.setCartProducts(this.cartProducts);
      this.calculateTotal();
    }, error => {
      console.error('Error saving cart:', error);
    });
  }

  getProductById(id: number): Product | undefined {
    const product = this.menuService.getProductById(id);
    console.log("Product in getProductById:", product);
    return product;
  }

  isCustomizableProduct(product: Product | CustomizableProduct): product is CustomizableProduct {
    return (product as CustomizableProduct).productList !== undefined;
  }
}