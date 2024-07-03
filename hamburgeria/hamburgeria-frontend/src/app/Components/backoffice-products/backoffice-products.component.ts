import { Component } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../Services/product.service';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-backoffice-products',
  templateUrl: './backoffice-products.component.html',
  styleUrls: ['./backoffice-products.component.scss']
})
export class BackofficeProductsComponent {
  products$: Product[] = [];
  filteredProducts$: Observable<Product[]>;

  private selectedCategory = new BehaviorSubject<string | null>(null);

  sections = [
    {
      id: 'dropdownMenu1',
      name: 'Burger',
      items: [
        'CUSTOMHAM_MEAT',
        'CUSTOMHAM_BREAD',
        'CUSTOMHAM_CHEESE',
        'CUSTOMHAM_VEGETABLE',
        'CUSTOMHAM_SAUCE',
        'CUSTOMHAM_OTHER',
      ]
    },
    {
      id: 'dropdownMenu2',
      name: 'Club Sandwich',
      items: [
        'CUSTOMSAND_BASE',
        'CUSTOMSANDHOT_CHEESE',
        'CUSTOMSANDHOT_VEGETABLE',
        'CUSTOMSANDHOT_SAUCE',
        'CUSTOMSANDHOT_OTHER',
      ]
    },
    {
      id: 'dropdownMenu3',
      name: 'Insalatona',
      items: [
        'CUSTOMHOTDOG_BASE',
        'CUSTOMSALAD_BASE',
        'CUSTOMSALAD_CHEESE',
        'CUSTOMSALAD_FVEGETABLES',
        'CUSTOMSALAD_CVEGETABLES',
        'CUSTOMSALAD_SAUCE',
        'CUSTOMSALAD_OTHER',
      ]
    },
    {
      id: 'dropdownMenu4',
      name: 'Dolce',
      items: [
        'DESSERT_BASE',
        'DESSERT_TOPPING',
        'DESSERT_SNACK',
      ]
    },
    {
      id: 'dropdownMenu5',
      name: 'Patate Fritte',
      items: [
        'FRI_FRENCHFRIES',
        'FRI_FRIEDCHICKEN',
        'FRI_OTHERFRIE',
        'FRI_SAUCE',
      ]
    },
    {
      id: 'dropdownMenu6',
      name: 'Non componibili',
      items: [
        'BURGER',
        'HOTDOG',
        'SANDWICH',
        'DRINK',
      ]
    }
  ];

  categories = [
    'CUSTOMHAM_MEAT',
    'CUSTOMHAM_BREAD',
    'CUSTOMHAM_CHEESE',
    'CUSTOMHAM_VEGETABLE',
    'CUSTOMHAM_SAUCE',
    'CUSTOMHAM_OTHER',
    'CUSTOMSAND_BASE',
    'CUSTOMSANDHOT_CHEESE',
    'CUSTOMSANDHOT_VEGETABLE',
    'CUSTOMSANDHOT_SAUCE',
    'CUSTOMSANDHOT_OTHER',
    'CUSTOMHOTDOG_BASE',
    'CUSTOMSALAD_BASE',
    'CUSTOMSALAD_CHEESE',
    'CUSTOMSALAD_FVEGETABLES',
    'CUSTOMSALAD_CVEGETABLES',
    'CUSTOMSALAD_SAUCE',
    'CUSTOMSALAD_OTHER',
    'DESSERT_BASE',
    'DESSERT_TOPPING',
    'DESSERT_SNACK',
    'FRI_FRENCHFRIES',
    'FRI_FRIEDCHICKEN',
    'FRI_OTHERFRIE',
    'FRI_SAUCE',
    'BURGER',
    'HOTDOG',
    'SANDWICH',
    'DRINK'
  ];

  newProduct: Partial<Product> = {
    italianName: '',
    englishName: '',
    italianDescription: '',
    englishDescription: '',
    price: 0,
    category: ''
  };

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

  selectNewProductCategory(category: string): void {
    this.newProduct.category = category;
  }

  addProduct(): void {
    /* if (!this.newProduct.italianName || !this.newProduct.englishName || !this.newProduct.italianDescription || !this.newProduct.englishDescription || !this.newProduct.category) {
      alert('Please fill in all the fields');
      return;
    } */

    const newProduct: Product = {
      id: Date.now(),
      italianName: this.newProduct.italianName!,
      englishName: this.newProduct.englishName!,
      italianDescription: this.newProduct.italianDescription!,
      englishDescription: this.newProduct.englishDescription!,
      price: this.newProduct.price!,
      category: this.newProduct.category!,
      available: true
    };

    this.products$.push(newProduct);
    console.log("new product", newProduct)
    this.productService.createProduct(newProduct).subscribe();
    this.productService.setProducts(this.products$);
    this.newProduct = {
      italianName: '',
      englishName: '',
      italianDescription: '',
      englishDescription: '',
      price: 0,
      category: ''
    };
  }
}
