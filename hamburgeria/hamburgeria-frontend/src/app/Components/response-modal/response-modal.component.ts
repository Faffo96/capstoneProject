import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-response-modal',
  templateUrl: './response-modal.component.html',
  styleUrl: './response-modal.component.scss'
})
export class ResponseModalComponent {
  @Input() title!: string;
  @Input() message!: string;
  @Input() isSuccess!: boolean;

  constructor(public activeModal: NgbActiveModal) {}
}