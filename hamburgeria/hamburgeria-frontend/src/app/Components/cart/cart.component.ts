import { Component, OnInit } from '@angular/core';
import { CartService } from '../../Services/cart.service';
import { Product } from '../../models/product';
import { CustomizableProduct } from '../../models/customizable-product';
import { ProductService } from '../../Services/product.service';
import { ErrorService } from '../../Services/error-service.service';
import { ResponseModalComponent } from '../response-modal/response-modal.component';
import { ConfirmModalService } from '../../Services/confirm-modal.service';
import { UserService } from '../../Services/user.service';
import { User } from '../../models/user';
import { Cart } from '../../models/cart';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartProducts: (Product | CustomizableProduct)[] = [];
  total: number = 0;
  discountedTotal: number = 0;
  applyDiscount: boolean = false;
  user: User | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private errorService: ErrorService,
    private confirmModalService: ConfirmModalService,
    private userService: UserService
  ) {
    this.userService.user$.subscribe(user => {
      this.user = user;
      console.log('User updated:', user);
    });
  }

  ngOnInit() {
    this.productService.currentCartProducts$.subscribe(data => {
      this.cartProducts = data;
      this.calculateTotal();
    });
  }

  calculateTotal() {
    this.total = this.cartProducts.reduce((sum, product) => {
      return sum + this.getProductTotal(product);
    }, 0);

    // Applica lo sconto se il checkbox è spuntato e l'utente ha abbastanza punti
    if (this.applyDiscount && this.canApplyDiscount()) {
      this.discountedTotal = Math.max(this.total - 10, 0);
    } else {
      this.discountedTotal = this.total;
    }
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
    this.confirmModalService.confirm(
      'Rimuovi Prodotto',
      `Sei sicuro di voler rimuovere ${product.italianName} dal carrello?`,
      () => this.removeProduct(product),
      'Rimuovi',
      'Annulla'
    );
  }

  removeProduct(product: Product | CustomizableProduct) {
    const index = this.cartProducts.findIndex(p => p.id === product.id);
    if (index !== -1) {
      this.cartProducts.splice(index, 1);
      this.productService.setCartProducts(this.cartProducts);
      this.calculateTotal();
    }
  }

  removeIngredient(customizableProduct: CustomizableProduct, ingredientIndex: number, event: MouseEvent) {
    event.stopPropagation();
    const ingredient = customizableProduct.productList[ingredientIndex];
    customizableProduct.productList.splice(ingredientIndex, 1);
    this.updateProductPrice(customizableProduct); // Aggiorna il prezzo considerando gli ingredienti gratuiti in eccesso
    this.calculateTotal();
    this.productService.setCartProducts(this.cartProducts);
  }

  updateProductPrice(customizableProduct: CustomizableProduct) {
    const freeIngredients = customizableProduct.productList.filter(ingredient => ingredient.price === 0 && !this.isBase(ingredient));
    const extraFreeIngredientsCount = Math.max(freeIngredients.length - 5, 0);
    const extraCharge = extraFreeIngredientsCount * 0.50;
    customizableProduct.price = customizableProduct.productList.reduce((sum, ingredient) => sum + ingredient.price, 0) + extraCharge;
  }

  isBase(ingredient: Product): boolean {
    return ingredient.category === 'DESSERT_BASE' || ingredient.category === 'CUSTOMHAM_BREAD' || ingredient.category === 'CUSTOMHAM_MEAT' || ingredient.category === 'CUSTOMSALAD_BASE' || ingredient.category === 'CUSTOMSAND_BASE';
  }

  canApplyDiscount(): boolean {
    return this.user !== null && this.user.points >= 10 && this.total >= 25;
  }

  checkout() {
    if (this.discountedTotal < 8.5) {
      this.confirmModalService.confirm(
        '❌ Errore',
        'Il totale deve essere maggiore di 8.5€ per procedere al checkout.',
        () => {},
        'Ok',
        'Annulla'
      );
      return;
    }

    this.confirmModalService.confirm(
      'Conferma Checkout',
      'Sei sicuro di voler procedere al checkout?',
      () => this.processCheckout(),
      'Conferma',
      'Annulla'
    );
  }

  processCheckout() {
    const cart = {
      productList: this.cartProducts
    };

    if (this.applyDiscount && this.canApplyDiscount() && this.user !== null) {
      const updatedPoints = this.user.points - 10;
      this.userService.patchUserPoints(this.user.email, updatedPoints).subscribe(updatedUser => {
        this.userService.setUser(updatedUser);
        this.cartService.createCart(cart).subscribe(response => {
          console.log('Cart saved:', response);
          this.cartProducts = [];
          this.productService.setCartProducts(this.cartProducts);
          this.calculateTotal();
          this.applyDiscount = false; // Deseleziona il checkbox dopo il checkout
          this.errorService.showErrorModal('✅ Checkout confermato', 'Checkout effettuato con successo! Stai per essere indirizzato alla pagina di pagamento.');
        }, error => {
          console.error('Error saving cart:', error);
        });
      });
    } else {
      this.cartService.createCart(cart).subscribe(response => {
        console.log('Cart saved:', response);
        this.cartProducts = [];
        this.productService.setCartProducts(this.cartProducts);
        this.calculateTotal();
        this.applyDiscount = false; // Deseleziona il checkbox dopo il checkout
        this.errorService.showErrorModal('✅ Checkout confermato', 'Checkout effettuato con successo! Stai per essere indirizzato alla pagina di pagamento.');
      }, error => {
        console.error('Error saving cart:', error);
      });
    }
  }

  getProductById(id: number): Product | undefined {
    const product = this.productService.getProductById(id);
    console.log("Product in getProductById:", product);
    return product;
  }

  isCustomizableProduct(product: Product | CustomizableProduct): product is CustomizableProduct {
    return (product as CustomizableProduct).productList !== undefined;
  }
}