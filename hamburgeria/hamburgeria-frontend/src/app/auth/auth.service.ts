import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthData } from '../models/auth-data.interface';
import { Register } from '../models/register.interface';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiURL = `${environment.apiURL}`;
  jwtHelper = new JwtHelperService();

  // elementi per gestire la procedura di login
  private authSub = new BehaviorSubject<AuthData | null>(null);
  user$ = this.authSub.asObservable();
  timeOut: any;

  constructor(private http: HttpClient, private router: Router) {}

  login(data: { email: string; password: string }) {
      return this.http.post<AuthData>(`${this.apiURL}login`, data).pipe(
          tap((data) => {
              console.log('Auth data: ', data);
          }),
          tap((data) => {
              this.authSub.next(data);
              localStorage.setItem('user', JSON.stringify(data));
              this.autoLogout(data);
          }),
          catchError(this.errors)
      );
  }

  signup(data: Register) {
      return this.http
          .post(`${this.apiURL}auth/registerCustomer`, data)
          .pipe(catchError(this.errors));
  }

  logout() {
      this.authSub.next(null);
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
  }

  restore() {
      const userJson = localStorage.getItem('user');
      if (!userJson) {
          return;
      }
      const user: AuthData = JSON.parse(userJson);
      this.authSub.next(user);
      this.autoLogout(user);
  }

  autoLogout(user: AuthData) {
      const dateExpiration = this.jwtHelper.getTokenExpirationDate(user.accessToken) as Date;
      const millisecondsExp = dateExpiration.getTime() - new Date().getTime();
      this.timeOut = setTimeout(() => {
          this.logout();
      }, millisecondsExp);
  }

  private errors(err: any) {
      console.log(err.error);
      switch (err.error) {
          case 'Email already exists':
              return throwError('utente già presente');
              break;

          case 'Incorrect password':
              return throwError('password errata');
              break;

          case 'Cannot find user':
              return throwError('Utente non trovato');
              break;

          default:
              return throwError('Errore nella chiamata');
              break;
      }
  }
}
