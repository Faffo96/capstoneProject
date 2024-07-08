import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResponseModalComponent } from '../Components/response-modal/response-modal.component';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private modalService: NgbModal) {}

  public handleError(error: HttpErrorResponse) {
    let translatedMessage = this.translateErrorMessage(error);
    this.showErrorModal('❌ Errore', translatedMessage);
  }

  private translateErrorMessage(error: HttpErrorResponse): string {
    switch (error.error.errorCode) {
      case 'UNAUTHORIZED':
        return 'Errore di autorizzazione, per favore rieffettua il login.';
      case 'NOT_FOUND':
        return 'Risorsa non trovata.';
      case 'INTERNAL_SERVER_ERROR':
        return 'Errore interno del server. Riprova più tardi.';
      // Aggiungi altri case per gestire altri errori specifici
      default:
        return 'Si è verificato un errore. Riprova più tardi.';
    }
  }

  public showErrorModal(title: string, message: string) {
    const modalRef = this.modalService.open(ResponseModalComponent, { centered: true });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.isSuccess = false;
  }

  public showReservationError(message: string) {
    this.showErrorModal('❌ Errore di Prenotazione', message);
  }

  public showMenuSectionsError(message: string) {
    this.showErrorModal('❌ Errore', message);
  }
}