import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { RouteService } from '../../Services/route.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit, OnInit, AfterViewChecked {
  currentRoute: string = '';
  headerHeight: string = '930px';
  private initialized = false;
  private routeSubscription!: Subscription;

  constructor(
    private routeService: RouteService,
    private renderer: Renderer2,
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    private router: Router) {}

  ngAfterViewInit() {
    this.cdr.detectChanges();
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
            bgImagePath = '../../../assets/img/header.png';
          } else if (route.startsWith('/reservation')) {
            bgImagePath = '../../../assets/img/reservation-header.png';
          } else if (route.startsWith('/backoffice')) {
            bgImagePath = '../../../assets/img/backoffice-header.png';
          } else if (route.startsWith('/login')) {
            bgImagePath = '../../../assets/img/login-header.png';
          } else if (route.startsWith('/register')) {
            bgImagePath = '../../../assets/img/register-header.png';
          } else if (route.startsWith('/profile')) {
            bgImagePath = '../../../assets/img/profile-header.png';
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
  }
}
