package com.koyeb.hamburgeria_backend.Controller;

import com.koyeb.hamburgeria_backend.Dto.ReservationDTO;
import com.koyeb.hamburgeria_backend.Entity.Reservation;
import com.koyeb.hamburgeria_backend.Exception.*;
import com.koyeb.hamburgeria_backend.Service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @PostMapping
    public ResponseEntity<Reservation> createReservation(@RequestBody ReservationDTO reservationDTO) throws UserNotFoundException, DiningTableNotFoundException, CartNotFoundException {
        Reservation createdReservation = reservationService.createReservation(reservationDTO);
        return ResponseEntity.ok(createdReservation);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable Long id) throws ReservationNotFoundException {
        Reservation reservation = reservationService.getReservationById(id);
        return ResponseEntity.ok(reservation);
    }

    @GetMapping("/user")
    public ResponseEntity<Page<Reservation>> getReservationsByUserEmail(
            @RequestParam String email,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy) {
        try {
            Page<Reservation> reservations = reservationService.getReservationsByUserEmail(email, page, sortBy);
            return ResponseEntity.ok(reservations);
        } catch (UnauthorizedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null); // Unauthorized
        }
    }

    @GetMapping("/userAndDate")
    public ResponseEntity<Page<Reservation>> getReservationsByUserEmailAndDateRange(
            @RequestParam String email,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy) {
        try {
            Page<Reservation> reservations = reservationService.getReservationsByUserEmailAndDateRange(email, startDate, endDate, page, sortBy);
            return ResponseEntity.ok(reservations);
        } catch (UnauthorizedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null); // Unauthorized
        }
    }

    @GetMapping
    public ResponseEntity<Page<Reservation>> getAllReservations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy) {
        Page<Reservation> reservations = reservationService.getReservations(page, sortBy);
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

    @GetMapping("/count/monthly")
    public Map<String, Long> getMonthlyReservationCount(@RequestParam int year) {
        return reservationService.getMonthlyReservationCountByYear(year);
    }

    @GetMapping("/count/daily")
    public Map<String, Long> getDailyReservationCount(@RequestParam int year, @RequestParam int month) {
        return reservationService.getDailyReservationCountByYearAndMonth(year, month);
    }

    @GetMapping("/count/hourly")
    public Map<String, Long> getHourlyReservationCount(@RequestParam int year, @RequestParam int month, @RequestParam int day) {
        return reservationService.getHourlyReservationCountByYearMonthAndDay(year, month, day);
    }
}
