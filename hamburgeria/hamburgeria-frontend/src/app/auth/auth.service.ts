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
import { UserService } from '../Services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiURL = `${environment.apiURL}`;
  jwtHelper = new JwtHelperService();

  private authSub = new BehaviorSubject<AuthData | null>(null);
  user$ = this.authSub.asObservable();
  timeOut: any;

  constructor(private http: HttpClient, private router: Router, private userService: UserService) {}

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  login(data: { email: string; password: string }): Observable<any> {
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
          this.userService.setUser(userDetails);
          localStorage.setItem('user', JSON.stringify(authData));
          this.autoLogout(authData);
          // Sposta la navigazione qui per assicurarti che l'utente sia impostato
          this.router.navigate(['/']);
        });
      }),
      catchError(this.handleError)
    );
  }

  fetchUserDetails(token: string): Observable<User> {
    return this.http.get<User>(`${this.apiURL}api/users`, {
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
    this.userService.clearUser();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  restore() {
    const token = this.getToken();
    if (!token) {
      return;
    }
    this.fetchUserDetails(token).subscribe(user => {
      const authData: AuthData = {
        accessToken: token,
        User: user
      };
      this.authSub.next(authData);
      this.userService.setUser(user);
      this.autoLogout(authData);
    }, error => {
      console.error('Error fetching user details', error);
      this.logout();
    });
  }

  autoLogout(user: AuthData) {
    const dateExpiration = this.jwtHelper.getTokenExpirationDate(user.accessToken) as Date;
    const millisecondsExp = dateExpiration.getTime() - new Date().getTime();
    this.timeOut = setTimeout(() => {
      this.logout();
    }, millisecondsExp);
  }

  private handleError(err: any) {
    console.log('Error occurred:', err.error);
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