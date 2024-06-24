import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthData } from '../models/auth-data.interface';
import { Register } from '../models/register.interface';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Role } from '../models/role';
import { User } from '../models/user';

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
    return this.http.post(`${this.apiURL}auth/login`, data, { responseType: 'text' }).pipe(
      tap(token => {
        console.log('Token received: ', token);
        localStorage.setItem('token', token);
        this.fetchUserDetails(token).subscribe(userDetails => {
          const authData: AuthData = {
            accessToken: token,
            User: userDetails
          };
          this.authSub.next(authData);
          localStorage.setItem('user', JSON.stringify(authData));
          this.autoLogout(authData);
        });
      }),
      catchError(this.handleError)
    );
  }

  fetchUserDetails(token: string) {
    return this.http.get<{ name: string; surname: string; email: string; avatar: string; role: Role; creationDate: string; }>(`${this.apiURL}auth/user`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    });
  }

  signup(data: User): Observable<any> {
    return this.http.post(`${this.apiURL}auth/registerCustomer`, data).pipe(
      tap(response => {
        console.log('Signup response: ', response);
        const loginData = { email: data.email, password: data.password };
        this.login(loginData).subscribe(
          loginResponse => {
            console.log('Login response: ', loginResponse);
          },
          loginError => {
            console.error('Login error: ', loginError);
          }
        );
      }),
      catchError(this.handleError)
    );
  }
  
  
  

  logout() {
    this.authSub.next(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
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

  private handleError(err: any) {
    console.log(err.error);
    let errorMessage = 'Errore nella chiamata';
    if (typeof err.error === 'string') {
      errorMessage = err.error;
    } else if (err.error instanceof ProgressEvent) {
      errorMessage = 'Errore di rete';
    } else if (err.error) {
      switch (err.error) {
        case 'Email already exists':
          errorMessage = 'Utente già presente';
          break;
        case 'Incorrect password':
          errorMessage = 'Password errata';
          break;
        case 'Cannot find user':
          errorMessage = 'Utente non trovato';
          break;
      }
    }
    return throwError(errorMessage);
  }
}
