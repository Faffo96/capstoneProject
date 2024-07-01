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

  getReservationsByUserEmail(email: string, page: number = 0, sortBy: string = 'id'): Observable<any> {
    return this.http.get<any>(`${this.apiURL}api/reservations/user?email=${email}&page=${page}&sortBy=${sortBy}`);
  }

  getAllReservations(sortBy: string = 'id'): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiURL}?sortBy=${sortBy}`);
  }

  updateReservation(id: number, reservationDTO: any): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiURL}api/reservations/${id}`, reservationDTO);
  }

  deleteReservation(id: number): Observable<string> {
    return this.http.delete(`${this.apiURL}api/reservations/${id}`, { responseType: 'text' });
  }
  
}

