import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, Observable } from 'rxjs';
import { DiningTable } from '../models/dining-table';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DiningTableService {
  apiURL = environment.apiURL;

  private dbDiningTablesSubject = new BehaviorSubject<DiningTable[]>([]);
  dbDiningTables$ = this.dbDiningTablesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getDiningTables(): Observable<{ content: DiningTable[] }> {
    return this.http.get<{ content: DiningTable[] }>(`${this.apiURL}api/diningTables`);
  }

  setDiningTables(diningTables: DiningTable[]): void {
    this.dbDiningTablesSubject.next(diningTables);
  }

  getDiningTableById(id: number): DiningTable | undefined {
    console.log("Current diningTables:", this.dbDiningTablesSubject.getValue());
    return this.dbDiningTablesSubject.getValue().find(diningTable => diningTable.id === id);
  }

  getDbDiningTablesValue(): DiningTable[] {
    return this.dbDiningTablesSubject.getValue();
  }

  setDbDiningTables(diningTables: DiningTable[]): void {
    this.dbDiningTablesSubject.next(diningTables);
  }
}