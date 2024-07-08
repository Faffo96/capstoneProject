import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthData } from '../models/auth-data.interface';
import { Register } from '../models/register.interface';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Role } from '../models/role';
import { User } from '../models/user';
import { UserService } from '../Services/user.service';
import { ErrorService } from '../Services/error-service.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiURL = `${environment.apiURL}`;
  jwtHelper = new JwtHelperService();

  private authSub = new BehaviorSubject<AuthData | null>(null);
  user$ = this.authSub.asObservable();
  timeOut: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private errorService: ErrorService
  ) {}

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiURL}auth/login`, data, { responseType: 'text' }).pipe(
      tap(token => {
        localStorage.setItem('token', token);
        this.userService.getUserFromToken(token).subscribe(userDetails => {
          const authData: AuthData = {
            accessToken: token,
            User: userDetails
          };
          this.authSub.next(authData);
          this.userService.setUser(userDetails).subscribe(() => {
            localStorage.setItem('user', JSON.stringify(authData));
            this.autoLogout(authData);
            this.router.navigate(['/']);
          });
        });
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  signup(data: User): Observable<any> {
    return this.http.post(`${this.apiURL}auth/registerCustomer`, data).pipe(
      tap(response => {
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
      catchError((error: HttpErrorResponse) => this.handleError(error))
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
      this.userService.setUser(user).subscribe(() => {
        this.autoLogout(authData);
      });
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

  private handleError(error: HttpErrorResponse) {
    this.errorService.handleError(error);
    return throwError(() => new Error(error.message));
  }

  fetchUserDetails(token: string): Observable<User> {
    return this.http.get<User>(`${this.apiURL}api/users`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    }).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }
}