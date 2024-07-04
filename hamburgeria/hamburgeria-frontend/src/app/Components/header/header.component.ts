import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { RouteService } from '../../Services/route.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../../Services/user.service';
import { User } from '../../models/user';
import { NgbAccordionItem } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit, OnInit, AfterViewChecked, OnDestroy {
  currentRoute: string = '';
  headerHeight: string = '930px';
  private initialized = false;
  private routeSubscription!: Subscription;
  private userSubscription!: Subscription;
  user$: User | null = null;

  constructor(
    private routeService: RouteService,
    private renderer: Renderer2,
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private userService: UserService,
  ) {
    this.userSubscription = this.userService.user$.subscribe(user => {
      this.user$ = user;
      console.log('User updated:', user);

    });
  }

  ngAfterViewInit() {
    
  }

  ngAfterViewChecked() {
    if (!this.initialized) {
      const imgs = document.getElementsByClassName('hover-image') as HTMLCollectionOf<HTMLImageElement>;
      const divs = document.getElementsByClassName('cta-h3') as HTMLCollectionOf<HTMLDivElement>;

      if (imgs.length && divs.length) {
        this.initialized = true;
        const iconName = ["cart", "dining-table"];

        for (let i = 0; i < imgs.length; i++) {
          const img = imgs[i];
          const div = divs[i];
          div.addEventListener('mouseenter', () => {
            const hoverSrc = img.getAttribute('src');
            if (hoverSrc) {
              img.src = hoverSrc;
              console.log(hoverSrc);
              img.src = `../../../assets/icons/animate/gif/${iconName[i]}.gif`;
            }
          });
        }
      }
    }
  }

  ngOnInit() {
    this.routeSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.routeService.getCurrentRoute().subscribe(route => {
          this.currentRoute = route;
          this.headerHeight = route === '/' ? '930px' : '300px';
          let bgImagePath = '';
          if (route === '/') {
            bgImagePath = '../../../assets/img/hamburger2.jpg';
          } else if (route.startsWith('/menu')) {
            bgImagePath = '../../../assets/img/header-menu.jpg';
          } else if (route.startsWith('/reservation')) {
            bgImagePath = '../../../assets/img/reservation-header.jpg';
          } else if (route.startsWith('/backoffice')) {
            bgImagePath = '../../../assets/img/backoffice-header.jpg';
          } else if (route.startsWith('/login')) {
            bgImagePath = '../../../assets/img/login-header.jpg';
          } else if (route.startsWith('/register')) {
            bgImagePath = '../../../assets/img/register-header.jpg';
          } else if (route.startsWith('/profile')) {
            bgImagePath = '../../../assets/img/profile-header.jpg';
          } else {
            bgImagePath = '../../../assets/img/default-bg.jpg';
          }
          const headerElement = this.el.nativeElement.querySelector('.header-bg-img');
          this.renderer.setStyle(headerElement, 'background-image', `url(${bgImagePath})`);
          this.initialized = false;  // Reset initialized to false
          this.cdr.detectChanges();  // Trigger change detection to re-run ngAfterViewChecked
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  closeOtherAccordions(openedItem: NgbAccordionItem) {
    if (openedItem.collapsed) {
      openedItem.toggle();
    }
  }
}