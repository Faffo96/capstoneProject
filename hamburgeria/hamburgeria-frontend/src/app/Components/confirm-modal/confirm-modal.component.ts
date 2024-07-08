import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorService } from '../../Services/error-service.service';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent {
  @Input() title: string = 'Conferma';
  @Input() message: string = 'Sei sicuro di voler procedere?';
  @Input() confirmButtonText: string = 'Ok';
  @Input() cancelButtonText: string = 'Annulla';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  constructor(public activeModal: NgbActiveModal) {}

  onConfirm() {
    this.confirm.emit();
    this.activeModal.close();
  }

  onCancel() {
    this.cancel.emit();
    this.activeModal.dismiss();
  }
}