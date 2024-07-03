import { Component } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../Services/product.service';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-backoffice-products',
  templateUrl: './backoffice-products.component.html',
  styleUrl: './backoffice-products.component.scss'
})
export class BackofficeProductsComponent {
  products$: Product[] = [];
  filteredProducts$: Observable<Product[]>;

  private selectedCategory = new BehaviorSubject<string | null>(null);

  burgerSections: string[] = [
    "CUSTOMHAM_MEAT",
    "CUSTOMHAM_BREAD",
    "CUSTOMHAM_CHEESE",
    "CUSTOMHAM_VEGETABLE",
    "CUSTOMHAM_SAUCE",
    "CUSTOMHAM_OTHER",
  ];

  friesSections: string[] = [
    "FRI_FRENCHFRIES",
    "FRI_FRIEDCHICKEN",
    "FRI_OTHERFRIE",
    "FRI_SAUCE",
  ];

  sandwichSections: string[] = [
    "CUSTOMSAND_BASE",
    "CUSTOMSANDHOT_CHEESE",
    "CUSTOMSANDHOT_VEGETABLE",
    "CUSTOMSANDHOT_SAUCE",
    "CUSTOMSANDHOT_OTHER",
  ];

  saladSections: string[] = [
    "CUSTOMHOTDOG_BASE",
    "CUSTOMSALAD_BASE",
    "CUSTOMSALAD_CHEESE",
    "CUSTOMSALAD_FVEGETABLES",
    "CUSTOMSALAD_CVEGETABLES",
    "CUSTOMSALAD_SAUCE",
    "CUSTOMSALAD_OTHER",
  ];

  dessertSections: string[] = [
    "DESSERT_BASE",
    "DESSERT_TOPPING",
    "DESSERT_SNACK",
  ];

  notCustomizableSections: string[] = [
    "BURGER",
    "HOTDOG",
    "SANDWICH",
    "DRINK",
  ];

  constructor(private productService: ProductService) {
    this.filteredProducts$ = combineLatest([
      this.productService.products$,
      this.selectedCategory
    ]).pipe(
      map(([products, category]) => {
        return category ? products.filter(product => product.category === category) : products;
      })
    );

    this.filteredProducts$.subscribe(products => {
      this.products$ = products;
      console.log('Filtered products:', this.products$);
    });
  }

  selectCategory(category: string): void {
    this.selectedCategory.next(category);
  }
}