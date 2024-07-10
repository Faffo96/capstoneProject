import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Product } from '../../models/product';
import { ProductService } from '../../Services/product.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements AfterViewInit, OnInit {
  menuSections = [
    {
      gif: "../../../assets/icons/animate/gif/hamburger.gif",
      name: "Burger Componibili",
      route: "customizeBurger"
    },
    {
      gif: "../../../assets/icons/animate/gif/chips.gif",
      name: "Fritture",
      route: "fries"
    },
    {
      gif: "../../../assets/icons/animate/gif/sandwich.gif",
      name: "Club Sandwich Componibili",
      route: "customizeSandwich"
    },
    {
      gif: "../../../assets/icons/animate/gif/hotdog.gif",
      name: "Hotdog",
      route: "hotdog"
    },
    {
      gif: "../../../assets/icons/animate/gif/salad.gif",
      name: "Insalatone",
      route: "salad"
    },
    {
      gif: "../../../assets/icons/animate/gif/dessert.gif",
      name: "Dolci",
      route: "dessert"
    },
    {
      gif: "../../../assets/icons/animate/gif/beer.gif",
      name: "Bevande",
      route: "drink"
    },
    {
      gif: "../../../assets/icons/animate/gif/hamburger2.gif",
      name: "Burger",
      route: "burger"
    },
    {
      gif: "../../../assets/icons/animate/gif/sandwich2.gif",
      name: "Sandwich",
      route: "sandwich"
    },
  ];
  currentRoute: string;
  selectedIngredients: Product[] = [];
  showTopBread: boolean = false;

  constructor(private router: Router, private productService: ProductService) {
    this.currentRoute = '';

    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.urlAfterRedirects;
    });

    this.productService.selectedProducts$.subscribe(products => {
      this.selectedIngredients = products;
    });

    this.productService.showTopBread$.subscribe(show => {
      this.showTopBread = show;
    });
  }

  ngOnInit(): void {
    // Altri codici di inizializzazione
  }

  ngAfterViewInit(): void {
    const imgs = document.getElementsByClassName('hover-image') as HTMLCollectionOf<HTMLImageElement>;
    const divs = document.getElementsByClassName('menu-section') as HTMLCollectionOf<HTMLDivElement>;
    const iconName = ["hamburger", "chips", "sandwich", "hotdog", "salad", "dessert", "beer", "hamburger2", "sandwich2"];

    for (let i = 0; i < imgs.length; i++) {
      const img = imgs[i];
      const div = divs[i];

      div.addEventListener('mouseenter', () => {
        const hoverSrc = img.getAttribute('src');
        if (hoverSrc) {
          img.src = `../../../assets/icons/animate/gif/${iconName[i]}.gif`;
        }
      });

      div.addEventListener('mouseleave', () => {
        // Optional: Restore the original src when mouse leaves
        const originalSrc = this.menuSections[i].gif;
        if (originalSrc) {
          img.src = originalSrc;
        }
      });
    }
  }

  isSelected(route: string): boolean {
    const fullRoute = `/menu/${route}`;
    return this.currentRoute === fullRoute;
  }

  biggerGif(menuSectionName: string): boolean {
    return ['Fritture', 'Insalatone', 'Dolci', 'Bevande'].includes(menuSectionName);
  }

  isCustomizableSection(): boolean {
    const currentRoute = this.router.url;
    return currentRoute.includes('customizeBurger') || currentRoute.includes('customizeSandwich') || currentRoute.includes('salad');
  }

  getIngredientImage(category: string): string {
    switch (category) {
      case 'CUSTOMHAM_CHEESE':
        return '../../../assets/img/cheese.png';
      case 'CUSTOMHAM_VEGETABLE':
        return '../../../assets/img/salad.png';
      case 'CUSTOMHAM_SAUCE':
        return '../../../assets/img/sauce.png';
      default:
        return '';
    }
  }

  isProductSelected(category: string): boolean {
    return this.selectedIngredients.some(product => product.category === category);
  }
}