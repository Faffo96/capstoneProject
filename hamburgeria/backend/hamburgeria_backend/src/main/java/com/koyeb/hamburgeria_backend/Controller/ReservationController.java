package com.koyeb.hamburgeria_backend.Controller;

import com.koyeb.hamburgeria_backend.Dto.ReservationDTO;
import com.koyeb.hamburgeria_backend.Entity.Reservation;
import com.koyeb.hamburgeria_backend.Exception.ReservationNotFoundException;
import com.koyeb.hamburgeria_backend.Exception.UnauthorizedException;
import com.koyeb.hamburgeria_backend.Exception.UserNotFoundException;
import com.koyeb.hamburgeria_backend.Service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @PostMapping
    public ResponseEntity<Reservation> createReservation(@RequestBody ReservationDTO reservationDTO) throws UserNotFoundException {
        Reservation createdReservation = reservationService.createReservation(reservationDTO);
        return ResponseEntity.ok(createdReservation);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable Long id) throws ReservationNotFoundException {
        Reservation reservation = reservationService.getReservationById(id);
        return ResponseEntity.ok(reservation);
    }

    @GetMapping("/user")
    public ResponseEntity<List<Reservation>> getReservationsByUserEmail(@RequestParam String email) {
        List<Reservation> reservations = reservationService.getReservationsByUserEmail(email);
        return ResponseEntity.ok(reservations);
    }

    @GetMapping
    public ResponseEntity<Page<Reservation>> getAllReservations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy) {
        Page<Reservation> reservations = reservationService.getAllReservations(page, sortBy);
        return ResponseEntity.ok(reservations);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reservation> updateReservation(@PathVariable Long id, @RequestBody ReservationDTO reservationDTO) {
        try {
            Reservation updatedReservation = reservationService.updateReservation(id, reservationDTO);
            return ResponseEntity.ok(updatedReservation);
        } catch (ReservationNotFoundException | UnauthorizedException | UserNotFoundException e) {
            return ResponseEntity.status(403).body(null); // Forbidden or not found
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReservation(@PathVariable Long id) {
        try {
            String result = reservationService.deleteReservation(id);
            return ResponseEntity.ok(result);
        } catch (ReservationNotFoundException e) {
            return ResponseEntity.status(404).body("Reservation not found with id: " + id);
        }
    }
}
