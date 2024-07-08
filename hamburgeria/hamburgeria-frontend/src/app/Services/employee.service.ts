import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeResponseDTO } from '../models/employee-response-dto';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiURL = environment.apiURL;

  constructor(private http: HttpClient) { }

  getAllEmployees(page: number = 0, sortBy: string = 'email'): Observable<any> {
    return this.http.get<any>(`${this.apiURL}api/employees?page=${page}&sortBy=${sortBy}`);
  }

  getAllEmployeesUnpaged(): Observable<EmployeeResponseDTO[]> {
    return this.http.get<EmployeeResponseDTO[]>(`${this.apiURL}api/employees/all`);
  }
}