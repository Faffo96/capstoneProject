import { Component, OnInit } from '@angular/core';
import { Reservation } from '../../models/reservation';
import { ReservationService } from '../../Services/reservation.service';
import { UserService } from '../../Services/user.service';
import { User } from '../../models/user';
import { ConfirmModalService } from '../../Services/confirm-modal.service';

@Component({
  selector: 'app-user-reservations',
  templateUrl: './user-reservations.component.html',
  styleUrl: './user-reservations.component.scss'
})
export class UserReservationsComponent implements OnInit {

  reservations: Reservation[] = [];
  currentPage: number = 0;
  totalPages: number = 0;
  pages: number[] = [];
  selectedReservation!: Reservation;
  isEditModalOpen: boolean = false;
  user$!: User | null;

  constructor(
    private reservationService: ReservationService,
    private userService: UserService,
    private confirmModalService: ConfirmModalService
  ) {
    this.userService.user$.subscribe(user => {
      this.user$ = user;
      console.log('User updated:', user);

      this.getReservations(this.currentPage);
    });
  }

  ngOnInit(): void {}

  getReservations(page: number): void {
    if (this.user$ != null) {
      const email = this.user$?.email; 
      this.reservationService.getReservationsByUserEmail(email, page, 'id').subscribe(
        (response: any) => {
          this.reservations = response.content;
          this.currentPage = response.number;
          this.totalPages = response.totalPages;
          this.pages = Array.from({ length: this.totalPages }, (_, i) => i);
        },
        (error: any) => {
          console.error('Error fetching reservations', error);
          if (error.status === 0) {
            console.error('Could not connect to server. Please make sure the server is running.');
          } else {
            console.error(`Backend returned code ${error.status}, body was: ${error.message}`);
          }
        }
      );
    }
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.getReservations(page);
    }
  }

  openEditModal(reservation: Reservation): void {
    this.selectedReservation = { ...reservation };
    this.isEditModalOpen = true;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
  }

  saveChanges(): void {
    this.reservationService.updateReservation(this.selectedReservation.id, this.selectedReservation).subscribe(
      () => {
        this.isEditModalOpen = false;
        this.getReservations(this.currentPage);
      },
      (error) => {
        console.error('Error updating reservation', error);
      }
    );
  }

  deleteReservation(reservationId: number): void {
    this.confirmModalService.confirm(
      'Conferma Eliminazione',
      'Sei sicuro di voler annullare questa prenotazione?',
      () => this.confirmDeleteReservation(reservationId)
    );
  }

  private confirmDeleteReservation(reservationId: number): void {
    this.reservationService.deleteReservation(reservationId).subscribe(
      () => {
        this.reservations = this.reservations.filter(reservation => reservation.id !== reservationId);
        console.log(`Reservation with id ${reservationId} deleted successfully.`);
      },
      (error) => {
        console.error('Error deleting reservation', error);
      }
    );
  }
}