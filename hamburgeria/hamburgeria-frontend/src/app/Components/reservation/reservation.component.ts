import { Component, OnInit } from '@angular/core';
import { DiningTableService } from '../../Services/dining-table.service';
import { DiningTable } from '../../models/dining-table';
import { ReservationService } from '../../Services/reservation.service';
import { ErrorService } from '../../Services/error-service.service';
import { ConfirmModalService } from '../../Services/confirm-modal.service';
import { DatePipe } from '../../pipes/date.pipe';
import { DateAndTimePipe } from '../../pipes/date-and-time.pipe';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
  providers: [DateAndTimePipe]
})
export class ReservationComponent implements OnInit {
  activeSeat: string | null = null;
  indoorTables: DiningTable[] = [];
  outdoorTables: DiningTable[] = [];
  participants!: number;
  reservationDate!: string;
  reservationTime!: string;
  availableTimes: string[] = [
    '19:00',
    '20:00',
    '21:00',
    '22:00'
  ];

  constructor(
    private diningTableService: DiningTableService,
    private reservationService: ReservationService,
    private errorService: ErrorService,
    private confirmModalService: ConfirmModalService,
    private dateAndTimePipe: DateAndTimePipe 
  ) {}

  ngOnInit() {
    this.diningTableService.dbDiningTables$.subscribe(data => {
      this.indoorTables = data.filter(table => !table.outside);
      this.outdoorTables = data.filter(table => table.outside);
      console.log('Indoor Tables:', this.indoorTables);
      console.log('Outdoor Tables:', this.outdoorTables);
    });

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
      bookedDate: this.combineDateAndTime(this.reservationDate, this.reservationTime),
      diningTable: table,
      participants: this.participants
    };

    // Controllo sul numero di partecipanti
    if (reservationDTO.participants > table.seating) {
      this.errorService.showReservationError(`Il numero di partecipanti inserito supera il limite del tavolo. Limite: ${table.seating} posti.`);
      return;
    }

    // Controllo sulla data
    const reservationDate = new Date(reservationDTO.bookedDate);
    const today = new Date();
    if (reservationDate < today) {
      this.errorService.showReservationError('La data di prenotazione non può essere antecedente al giorno di oggi.');
      return;
    }

    if (!reservationDTO.bookedDate || !reservationDTO.participants || !this.reservationTime) {
      this.errorService.showReservationError('Per favore, inserisci una data di prenotazione, un numero di partecipanti e un orario.');
      return;
    }

    this.confirmModalService.confirm(
      'Conferma Prenotazione',
      `Sei sicuro di voler prenotare il tavolo ${reservationDTO.diningTable.tableNumber} per ${reservationDTO.participants} persone il ` + this.dateAndTimePipe.transform(reservationDTO.bookedDate) + '?',
      () => this.confirmBooking(reservationDTO)
    );
  }

  confirmBooking(reservationDTO: any) {
    this.reservationService.createReservation(reservationDTO).subscribe(response => {
      this.errorService.showErrorModal('Tavolo Prenotato', `Il tavolo ${reservationDTO.diningTable.tableNumber} è stato prenotato per il ` + this.dateAndTimePipe.transform(reservationDTO.bookedDate) + ` per ${reservationDTO.participants} persone`);
    }, error => {
      this.errorService.showReservationError('Errore durante la prenotazione: ' + error.message);
    });
  }

  private combineDateAndTime(date: string, time: string): string {
    return `${date}T${time}:00`;
  }
}