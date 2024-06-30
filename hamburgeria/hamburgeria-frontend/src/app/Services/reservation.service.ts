import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, Observable } from 'rxjs';
import { DiningTable } from '../models/dining-table';
import { HttpClient } from '@angular/common/http';
import { Reservation } from '../models/reservation';
import { ReservationDTO } from '../models/reservation-dto';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private apiURL = environment.apiURL;

  constructor(private http: HttpClient) { }

  createReservation(data: any): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.apiURL}api/reservations`, data);
  }

  getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiURL}/${id}`);
  }

  getReservationsByUserEmail(email: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiURL}/user?email=${email}`);
  }

  getAllReservations(page: number = 0, sortBy: string = 'id'): Observable<any> {
    return this.http.get<any>(`${this.apiURL}?page=${page}&sortBy=${sortBy}`);
  }

  updateReservation(id: number, reservationDTO: any): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiURL}/${id}`, reservationDTO);
  }

  deleteReservation(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiURL}/${id}`);
  }
}