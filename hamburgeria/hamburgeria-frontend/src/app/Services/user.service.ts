import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiURL = environment.apiURL;

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) { }

  getUserFromToken(token: string): Observable<User> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(`${this.apiURL}api/jwt/getUserFromToken`, { headers });
  }

  setUser(user: User): void {
    this.userSubject.next(user);
  }

  clearUser(): void {
    this.userSubject.next(null);
  }

  getUserValue(): User | null {
    return this.userSubject.getValue();
  }

  // Patch Email
  patchUserEmail(currentEmail: string, newEmail: string): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.patch<User>(`${this.apiURL}api/users/${currentEmail}/email`, { newEmail }, { headers });
  }

  // Patch Password
  patchUserPassword(email: string, newPassword: string): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.patch<User>(`${this.apiURL}api/users/${email}/password`, { newPassword }, { headers });
  }

  // Patch Name
  patchUserName(email: string, newName: string): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.patch<User>(`${this.apiURL}api/users/${email}/name`, { newName }, { headers });
  }

  // Patch Surname
  patchUserSurname(email: string, newSurname: string): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.patch<User>(`${this.apiURL}api/users/${email}/surname`, { newSurname }, { headers });
  }
}