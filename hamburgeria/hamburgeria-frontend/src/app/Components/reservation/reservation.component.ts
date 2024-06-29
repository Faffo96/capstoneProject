import { Component } from '@angular/core';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent {
  activeSeat: string | null = null;

  toggleTooltip(seatId: string) {
    this.activeSeat = this.activeSeat === seatId ? null : seatId;
  }

  activateTooltip(seatId: string) {
    this.activeSeat = seatId;
  }

  deactivateTooltip() {
    this.activeSeat = null;
  }
}