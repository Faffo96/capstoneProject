package com.koyeb.hamburgeria_backend.Repository;

import com.koyeb.hamburgeria_backend.Entity.Reservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    @Query("SELECT r FROM Reservation r WHERE r.user.email = :email")
    Page<Reservation> findByUserEmail(String email, Pageable pageable);

    @Query("SELECT r FROM Reservation r WHERE r.user.email = :email AND r.bookedDate BETWEEN :startDate AND :endDate")
    Page<Reservation> findByUserEmailAndDateRange(@Param("email") String email, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate, Pageable pageable);
}