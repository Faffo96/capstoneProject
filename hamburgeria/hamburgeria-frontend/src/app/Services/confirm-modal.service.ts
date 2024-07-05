import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../Components/confirm-modal/confirm-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmModalService {
    constructor(private modalService: NgbModal) {}
  
    confirm(
      title: string,
      message: string,
      onConfirm: () => void,
      confirmButtonText: string = 'Ok',
      cancelButtonText: string = 'Annulla'
    ): void {
      const modalRef = this.modalService.open(ConfirmModalComponent, { centered: true });
      modalRef.componentInstance.title = title;
      modalRef.componentInstance.message = message;
      modalRef.componentInstance.confirmButtonText = confirmButtonText;
      modalRef.componentInstance.cancelButtonText = cancelButtonText;
  
      modalRef.componentInstance.confirm.subscribe(() => onConfirm());
    }
  }