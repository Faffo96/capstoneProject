import { Component, OnInit } from '@angular/core';
import { EmployeeResponseDTO } from '../../models/employee-response-dto';
import { EmployeeService } from '../../Services/employee.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { ConfirmModalService } from '../../Services/confirm-modal.service';
import { ErrorService } from '../../Services/error-service.service';

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

  constructor(private employeeService: EmployeeService, private confirmModalService: ConfirmModalService, private errorService: ErrorService) { }

  ngOnInit(): void {
    this.getEmployees(this.currentPage);
  }

  getEmployees(page: number): void {
    this.employeeService.getAllEmployees(page).subscribe(
      (response: any) => {
        console.log('Employees response:', response);
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
  
  confirmDeleteProfile(employee: EmployeeResponseDTO): void {
    this.confirmModalService.confirm(
      'Conferma Eliminazione',
      `Sei sicuro di voler eliminare il profilo di ${employee.name} ${employee.surname}?`,
      () => this.errorService.showErrorModal('✅ Completato', 'Dipendente eliminato.')    );
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.getEmployees(page);
    }
  }

  performAction(employee: EmployeeResponseDTO): void {
    console.log('Azione eseguita per:', employee);
    console.log('Avatar URL:', employee.avatar); // Controlla l'URL dell'avatar qui
  }
  
}