import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShiftDTO } from '../models/shift-dto';
import { environment } from '../../environments/environment.development';
import { PagedResponse } from '../models/paged-response';


@Injectable({
  providedIn: 'root'
})
export class ShiftService {
  private apiURL = environment.apiURL;

  constructor(private http: HttpClient) { }

  getShifts(): Observable<PagedResponse<ShiftDTO>> {
    return this.http.get<PagedResponse<ShiftDTO>>(`${this.apiURL}api/shifts`);
  }

  createShift(shift: ShiftDTO): Observable<ShiftDTO> {
    return this.http.post<ShiftDTO>(`${this.apiURL}api/shifts`, shift);
  }
}