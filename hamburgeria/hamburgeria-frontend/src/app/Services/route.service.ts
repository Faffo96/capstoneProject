import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  private currentRoute = new BehaviorSubject<string>('');

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute.next(event.urlAfterRedirects);
      }
    });
  }

  getCurrentRoute() {
    return this.currentRoute.asObservable();
  }
}
