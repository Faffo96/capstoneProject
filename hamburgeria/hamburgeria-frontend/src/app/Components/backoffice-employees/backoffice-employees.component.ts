import { Component, OnInit } from '@angular/core';
import { EmployeeResponseDTO } from '../../models/employee-response-dto';
import { EmployeeService } from '../../Services/employee.service';

@Component({
  selector: 'app-backoffice-employees',
  templateUrl: './backoffice-employees.component.html',
  styleUrl: './backoffice-employees.component.scss'
})
export class BackofficeEmployeesComponent implements OnInit {
  employees: EmployeeResponseDTO[] = [];
  currentPage: number = 0;
  totalPages: number = 0;
  pages: number[] = [];

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.getEmployees(this.currentPage);
  }

  getEmployees(page: number): void {
    this.employeeService.getAllEmployees(page).subscribe(
      (response: any) => {
        this.employees = response.content;
        this.currentPage = response.number;
        this.totalPages = response.totalPages;
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i);
      },
      (error: any) => {
        console.error('Error fetching employees', error);
      }
    );
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.getEmployees(page);
    }
  }

  performAction(employee: EmployeeResponseDTO): void {

    console.log('Azione eseguita per:', employee);
  }
}