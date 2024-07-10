import { Component, OnInit } from '@angular/core';
import { CustomerResponseDTO } from '../../models/customer-response-dto';
import { CustomerService } from '../../Services/customer.service';
import { ConfirmModalService } from '../../Services/confirm-modal.service';
import { ErrorService } from '../../Services/error-service.service';

@Component({
  selector: 'app-backoffice-users',
  templateUrl: './backoffice-users.component.html',
  styleUrl: './backoffice-users.component.scss'
})
export class BackofficeUsersComponent implements OnInit {
  customers: CustomerResponseDTO[] = [];
  currentPage: number = 0;
  totalPages: number = 0;
  pages: number[] = [];

  constructor(private customerService: CustomerService, private confirmModalService: ConfirmModalService, private errorService: ErrorService) { }

  ngOnInit(): void {
    this.getCustomers(this.currentPage);
  }

  getCustomers(page: number): void {
    this.customerService.getAllCustomers(page).subscribe(
      (response: any) => {
        this.customers = response.content;
        this.currentPage = response.number;
        this.totalPages = response.totalPages;
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i);
      },
      (error: any) => {
        console.error('Error fetching customers', error);
      }
    );
  }

  confirmDeleteProfile(customer: CustomerResponseDTO): void {
    this.confirmModalService.confirm(
      'Conferma Eliminazione',
      `Sei sicuro di voler eliminare il profilo di ${customer.name} ${customer.surname}?`,
      () => this.errorService.showErrorModal('✅ Completato', 'Utente eliminato.')
    );
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.getCustomers(page);
    }
  }

  performAction(customer: CustomerResponseDTO): void {
    // Aggiungi la logica per il bottone qui
    console.log('Azione eseguita per:', customer);
  }
}