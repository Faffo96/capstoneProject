import { Component, OnInit } from '@angular/core';
import { DiningTableService } from '../../Services/dining-table.service';
import { DiningTable } from '../../models/dining-table';
import { ReservationService } from '../../Services/reservation.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit {
  activeSeat: string | null = null;
  indoorTables: DiningTable[] = [];
  outdoorTables: DiningTable[] = [];
  participants!: number;
  reservationDate!: string;

  constructor(private diningTableService: DiningTableService, private reservationService: ReservationService) {}

  ngOnInit() {
    this.diningTableService.dbDiningTables$.subscribe(data => {
      this.indoorTables = data.filter(table => !table.outside);
      this.outdoorTables = data.filter(table => table.outside);
      console.log('Indoor Tables:', this.indoorTables);
      console.log('Outdoor Tables:', this.outdoorTables);
    });

    // Fetch initial dining tables from the service
    this.diningTableService.getDiningTables().subscribe(data => {
      this.diningTableService.setDiningTables(data.content);
    });
  }

  toggleTooltip(seatId: string) {
    this.activeSeat = this.activeSeat === seatId ? null : seatId;
  }

  activateTooltip(seatId: string) {
    this.activeSeat = seatId;
  }

  deactivateTooltip() {
    this.activeSeat = null;
  }

  getClassList(table: DiningTable, index: number, isOutdoor: boolean): string[] {
    if (!isOutdoor) {
      return ['bg-color1', `seat-${index}`];
    } else {
      return ['bg-color2', `seat-out-${index}`];
    }
  }

  bookTable(table: DiningTable) {
    const reservationDTO = {
      id: table.id,
      bookedDate: this.reservationDate,
      diningTable: table,
      participants: this.participants
    };

    this.reservationService.createReservation(reservationDTO).subscribe(response => {
      alert('Prenotazione effettuata con successo!');
      // Aggiungi eventuali azioni aggiuntive, come l'aggiornamento della lista delle prenotazioni
    }, error => {
      alert('Errore durante la prenotazione: ' + error.message);
    });
  }
}