import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MenuService } from '../../Services/menu.service';
import { Product } from '../../models/product';
import { CartService } from '../../Services/cart.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, AfterViewInit {
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
/*   menuProducts: Product[] = []; */
  currentRoute: string;

  constructor(private router: Router, private menuService: MenuService, private cartService: CartService) {
    this.currentRoute = '';

    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.urlAfterRedirects;

/*       this.cartService.cart$.subscribe(data => {
        this.menuProducts = data;
      }) */


    
      /* console.log(  this.isSelected(event.urlAfterRedirects.split("/menu/",)[0])) */
    });

    
    
  }

  ngOnInit() {
    

    
  }

  ngAfterViewInit() {
    const imgs = document.getElementsByClassName('hover-image') as HTMLCollectionOf<HTMLImageElement>;
    const divs = document.getElementsByClassName('menu-section') as HTMLCollectionOf<HTMLDivElement>;
    const iconName = ["hamburger", "chips", "sandwich", "hotdog", "salad", "dessert", "beer", "hamburger2", "sandwich2"];

    for (let i = 0; i < imgs.length; i++) {
      const img = imgs[i];
      const div = divs[i];

      div.addEventListener('mouseenter', () => {
        const hoverSrc = img.getAttribute('src');
        if (hoverSrc) {
          img.src = hoverSrc;
          img.src = `../../../assets/icons/animate/gif/${iconName[i]}.gif`;
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
}
