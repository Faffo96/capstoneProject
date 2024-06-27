import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../Services/menu.service';
import { Product } from '../../models/product';
import { Category } from '../../models/category';

@Component({
  selector: 'app-customize-burger',
  templateUrl: './customize-burger.component.html',
  styleUrl: './customize-burger.component.scss'
})
export class CustomizeBurgerComponent implements OnInit {
  products: Product[] = [];
  sections: { name: string, products: Product[] }[] = [
    { name: 'Hamburger', products: [] },
    { name: 'Pane', products: [] },
    { name: 'Verdure', products: [] },
    { name: 'Formaggi', products: [] },
    { name: 'Salse', products: [] },
    { name: 'Varie', products: [] }
  ];

  ngOnInit(): void {
      
      
  }

  constructor (private menuService: MenuService) {
    this.menuService.products$.subscribe(data => {
      this.products = data;
      this.loadCategories();
    })

    
  }

  loadCategories() {
    for (let i = 0; i < this.products.length; i++) {
      const e = this.products[i];
      switch (e.category) {
        case 'CUSTOMHAM_MEAT':
          this.sections.find(section => section.name === 'Hamburger')?.products.push(e);
          break;
        case 'CUSTOMHAM_BREAD':
          this.sections.find(section => section.name === 'Pane')?.products.push(e);
          break;
        case 'CUSTOMHAM_CHEESE':
          this.sections.find(section => section.name === 'Formaggi')?.products.push(e);
          break;
        case 'CUSTOMHAM_VEGETABLE':
          this.sections.find(section => section.name === 'Verdure')?.products.push(e);
          break;
        case 'CUSTOMHAM_SAUCE':
          this.sections.find(section => section.name === 'Salse')?.products.push(e);
          break;
        case 'CUSTOMHAM_OTHER':
          this.sections.find(section => section.name === 'Varie')?.products.push(e);
          break;
        default:
          break;
      }

      
    }
  }
}
